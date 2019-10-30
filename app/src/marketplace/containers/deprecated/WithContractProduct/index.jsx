// @flow

import React, { Component as ReactComponent, type ComponentType } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import { selectAccountId } from '$mp/modules/web3/selectors'
import { selectProduct } from '$mp/modules/product/selectors'
import { getProductFromContract, clearContractProduct as clearContractProductAction } from '$mp/modules/contractProduct/actions'
import { selectFetchingContractProduct, selectContractProduct, selectContractProductError } from '$mp/modules/contractProduct/selectors'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import UnlockWalletDialog from '$mp/components/Modal/UnlockWalletDialog'
import { isPaidProduct } from '$mp/utils/product'
import { areAddressesEqual } from '$mp/utils/smartContract'
import type { ProductId, Product, SmartContractProduct } from '$mp/flowtype/product-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { StoreState } from '$shared/flowtype/store-state'
import type { Address } from '$shared/flowtype/web3-types'
import withWeb3 from '$shared/utils/withWeb3'

type StateProps = {
    product: ?Product,
    contractProduct: ?SmartContractProduct,
    fetchingContractProduct: boolean,
    contractProductError: ?ErrorInUi,
    accountId: ?Address,
}

type DispatchProps = {
    getContractProduct: (id: ProductId) => void,
    clearContractProduct: () => void,
}

type OwnProps = {
    productId: ProductId,
    requireWeb3: boolean,
    requireOwnerIfDeployed: boolean,
    requireInContract: boolean,
    onClose: () => void,
}

export type Props = StateProps & DispatchProps & OwnProps

export function withContractProduct(WrappedComponent: ComponentType<any>) {
    const mapStateToProps = (state: StoreState): StateProps => ({
        product: selectProduct(state),
        contractProduct: selectContractProduct(state),
        fetchingContractProduct: selectFetchingContractProduct(state),
        contractProductError: selectContractProductError(state),
        accountId: selectAccountId(state),
    })

    const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
        getContractProduct: (id: ProductId) => dispatch(getProductFromContract(id)),
        clearContractProduct: () => dispatch(clearContractProductAction()),
    })

    class WithContractProduct extends ReactComponent<Props> {
        static defaultProps = {
            requiredOwner: false,
            requireOwnerIfDeployed: false,
            requireInContract: false,
        }

        constructor(props: Props) {
            super(props)
            const {
                productId,
                product,
                fetchingContractProduct,
                getContractProduct,
                clearContractProduct,
            } = this.props

            if (product && isPaidProduct(product) && !fetchingContractProduct && productId) {
                getContractProduct(productId)
            }

            if (!productId) {
                clearContractProduct()
            }
        }

        render() {
            const {
                requireWeb3,
                product,
                contractProduct,
                fetchingContractProduct,
                contractProductError,
                onClose,
                accountId,
                requireOwnerIfDeployed,
                requireInContract,
            } = this.props

            if (product) {
                if (requireWeb3 && isPaidProduct(product)) {
                    // Product not found at all
                    if (requireInContract && (!contractProduct || contractProductError)) {
                        return (
                            <ErrorDialog
                                title={product.name}
                                message={!!contractProductError && contractProductError.message}
                                waiting={fetchingContractProduct}
                                onClose={onClose}
                            />
                        )
                    }

                    // Product is deployed but need to check if the owner is correct
                    if (requireOwnerIfDeployed && contractProduct && !areAddressesEqual(accountId || '', contractProduct.ownerAddress)) {
                        return (
                            <UnlockWalletDialog
                                onClose={onClose}
                                message={I18n.t('unlockWalletDialog.message', {
                                    address: contractProduct.ownerAddress,
                                })}
                            />
                        )
                    }
                }

                return (
                    <WrappedComponent
                        requireWeb3={!isPaidProduct(product) || !!contractProduct}
                        {...this.props}
                    />
                )
            }

            return (
                <WrappedComponent
                    {...this.props}
                />
            )
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(withWeb3(WithContractProduct))
}

export default withContractProduct
