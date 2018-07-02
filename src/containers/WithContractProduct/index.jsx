// @flow

import React, { Component as ReactComponent, type ComponentType } from 'react'
import { connect } from 'react-redux'
import { I18n } from '@streamr/streamr-layout'

import { selectAccountId } from '../../modules/web3/selectors'
import { selectProduct } from '../../modules/product/selectors'
import { getProductFromContract } from '../../modules/contractProduct/actions'
import { selectFetchingContractProduct, selectContractProduct, selectContractProductError } from '../../modules/contractProduct/selectors'
import ErrorDialog from '../../components/Modal/ErrorDialog'
import UnlockWalletDialog from '../../components/Modal/UnlockWalletDialog'
import { isPaidProduct } from '../../utils/product'
import { areAddressesEqual } from '../../utils/smartContract'
import { hideModal } from '../../modules/modals/actions'
import type { ProductId, Product, SmartContractProduct } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { StoreState } from '../../flowtype/store-state'
import type { Address } from '../../flowtype/web3-types'

import withWeb3 from '../WithWeb3'

type StateProps = {
    product: ?Product,
    contractProduct: ?SmartContractProduct,
    fetchingContractProduct: boolean,
    contractProductError: ?ErrorInUi,
    accountId: ?Address,
}

type DispatchProps = {
    getContractProduct: (id: ProductId) => void,
    onCancel: () => void,
}

type OwnProps = {
    productId: ProductId,
    requireWeb3: boolean,
    requireOwnerIfDeployed: boolean,
    requireInContract: boolean,
    onCancel: () => void,
}

type Props = StateProps & DispatchProps & OwnProps

export function withContractProduct(WrappedComponent: ComponentType<any>) {
    const mapStateToProps = (state: StoreState): StateProps => ({
        product: selectProduct(state),
        contractProduct: selectContractProduct(state),
        fetchingContractProduct: selectFetchingContractProduct(state),
        contractProductError: selectContractProductError(state),
        accountId: selectAccountId(state),
    })

    const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
        getContractProduct: (id: ProductId) => dispatch(getProductFromContract(id)),
        onCancel: () => {
            if (ownProps.onCancel) {
                ownProps.onCancel()
            } else {
                dispatch(hideModal())
            }
        },
    })

    class WithContractProduct extends ReactComponent<Props> {
        static defaultProps = {
            requiredOwner: false,
            requireOwnerIfDeployed: false,
            requireInContract: false,
        }

        constructor(props: Props) {
            super(props)
            const { productId,
                product,
                fetchingContractProduct,
                getContractProduct } = this.props

            if (product && isPaidProduct(product) && !fetchingContractProduct && productId) {
                getContractProduct(productId)
            }
        }

        render() {
            const {
                requireWeb3,
                product,
                contractProduct,
                fetchingContractProduct,
                contractProductError,
                onCancel,
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
                                onDismiss={onCancel}
                            />
                        )
                    }

                    // Product is deployed but need to check if the owner is correct
                    if (requireOwnerIfDeployed && contractProduct && !areAddressesEqual(accountId || '', contractProduct.ownerAddress)) {
                        return (
                            <UnlockWalletDialog
                                onCancel={onCancel}
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
