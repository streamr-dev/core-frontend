// @flow

import React, { Component as ReactComponent, type ComponentType } from 'react'
import { connect } from 'react-redux'

import { selectAccountId } from '../../modules/web3/selectors'
import { selectProduct } from '../../modules/product/selectors'
import { getProductFromContract } from '../../modules/contractProduct/actions'
import { selectFetchingContractProduct, selectContractProduct, selectContractProductError } from '../../modules/contractProduct/selectors'
import ErrorDialog from '../../components/Modal/ErrorDialog'
import UnlockWalletDialog from '../../components/Modal/UnlockWalletDialog'
// import { isPaidProduct } from '../../utils/product'
import { productStates } from '../../utils/constants'
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
    requireDeployed: boolean,
    requireOwnerIfDeployed: boolean,
    onCancel: () => void,
}

type Props = StateProps & DispatchProps & OwnProps

export function withContractProduct(WrappedComponent: ComponentType<any>, lightBackdrop: boolean = false) {
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

    class Component extends ReactComponent<Props> {
        static defaultProps = {
            requiredOwner: false,
            requireDeployed: false,
            requireOwnerIfDeployed: false,
        }

        componentWillMount() {
            const { productId, fetchingContractProduct, requireDeployed, getContractProduct } = this.props

            if (productId && requireDeployed && !fetchingContractProduct) {
                getContractProduct(productId)
            }
        }

        render() {
            const {
                product,
                contractProduct,
                fetchingContractProduct,
                contractProductError,
                onCancel,
                accountId,
                requireOwnerIfDeployed,
                requireDeployed,
            } = this.props

            if (product) {
                // Check that product exists in contract
                if (requireDeployed) {
                    // Product not found at all
                    if (!contractProduct || contractProductError) {
                        return (
                            <ErrorDialog
                                title={product.name}
                                message={!!contractProductError && contractProductError.message}
                                waiting={fetchingContractProduct}
                                onDismiss={onCancel}
                            />
                        )
                    }

                    // Product found but not deployed
                    if (requireDeployed && contractProduct && contractProduct.state !== productStates.DEPLOYED) {
                        return (
                            <ErrorDialog
                                title={product.name}
                                message="Product not found"
                                onDismiss={onCancel}
                            />
                        )
                    }

                    // Product is deployed but need to check if the owner is correct
                    if (requireOwnerIfDeployed && accountId !== contractProduct.ownerAddress) {
                        return (
                            <UnlockWalletDialog
                                lightBackdrop={lightBackdrop}
                                onCancel={onCancel}
                                message={`Please select the account with address ${contractProduct.ownerAddress}`}
                            />
                        )
                    }
                }

                return (
                    <WrappedComponent
                        {...this.props}
                    />
                )
            }

            return null
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(withWeb3(Component, lightBackdrop))
}

export default withContractProduct
