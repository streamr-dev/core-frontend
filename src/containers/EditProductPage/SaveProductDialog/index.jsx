// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { arePricesEqual } from '../../../utils/price'
import { areAddressesEqual } from '../../../utils/smartContract'
import { selectProduct } from '../../../modules/product/selectors'
import { selectEnabled } from '../../../modules/web3/selectors'
import type { StoreState } from '../../../flowtype/store-state'
import type { Product, ProductId, EditProduct, SmartContractProduct } from '../../../flowtype/product-types'
import type { TransactionState, ErrorInUi } from '../../../flowtype/common-types'
import UnlockWalletDialog from '../../../components/Modal/UnlockWalletDialog'
import SaveProductDialogComponent from '../../../components/Modal/SaveProductDialog'
import ErrorDialog from '../../../components/Modal/ErrorDialog'
// import ApproveTransactionDialog from '../../../components/Modal/ApproveTransactionDialog'
import { formatPath } from '../../../utils/url'
import links from '../../../links'
// import { productStates } from '../../utils/constants'
import { selectEditProduct, selectTransactionState as selectUpdateTransactionState } from '../../../modules/editProduct/selectors'
import { selectTransactionState as selectContractTransactionState } from '../../../modules/updateContractProduct/selectors'
import { updateContractProduct as updateContractProductAction } from '../../../modules/updateContractProduct/actions'
import { selectFetchingContractProduct, selectContractProduct, selectContractProductError } from '../../../modules/contractProduct/selectors'
import { getProductFromContract } from '../../../modules/contractProduct/actions'
import { isPaidProduct } from '../../../utils/product'
import { updateProduct as updateProductAction } from '../../../modules/editProduct/actions'
import { hideModal } from '../../../modules/modals/actions'
import { transactionStates } from '../../../utils/constants'

export const redirectIntents = {
    MY_PRODUCTS: 'myProducts',
    PUBLISH: 'publish',
}

type StateProps = {
    walletEnabled: boolean,
    product: ?Product,
    editProduct: ?EditProduct, // eslint-disable-line react/no-unused-prop-types
    contractProduct: ?SmartContractProduct, // eslint-disable-line react/no-unused-prop-types
    fetchingContractProduct: boolean,
    contractProductError: ?ErrorInUi,
    contractTransactionState: ?TransactionState,
    updateTransactionState: ?TransactionState,
}

type DispatchProps = {
    getContractProduct: (ProductId) => void,
    updateProduct: () => void, // eslint-disable-line react/no-unused-prop-types
    updateContractProduct: (ProductId, SmartContractProduct) => void, // eslint-disable-line react/no-unused-prop-types
    onCancel: () => void,
    doRedirect: (ProductId, string) => void, // eslint-disable-line react/no-unused-prop-types
}

type OwnProps = {
    redirectIntent: string, // eslint-disable-line react/no-unused-prop-types
}

type Props = StateProps & DispatchProps & OwnProps

class SaveProductDialog extends React.Component<Props> {
    componentDidMount() {
        const { product } = this.props

        if (product && product.id && isPaidProduct(product)) {
            this.props.getContractProduct(product.id)
        }

        this.startTransaction(this.props)
    }

    componentWillReceiveProps(nextProps: Props) {
        this.startTransaction(nextProps)
    }

    updateTransactionStarted: boolean = false
    contractTransactionStarted: boolean = false

    startTransaction = (props: Props) => {
        const {
            walletEnabled,
            product,
            editProduct,
            updateContractProduct,
            updateProduct,
            contractProduct,
            redirectIntent,
            contractTransactionState,
            updateTransactionState,
            doRedirect,
        } = props

        if (product && editProduct) {
            // Determine if we need to update price or beneficiaryAddress to contract
            if (isPaidProduct(product) && walletEnabled && contractProduct &&
                !this.contractTransactionStarted &&
                (!arePricesEqual(contractProduct.pricePerSecond, editProduct.pricePerSecond) ||
                !areAddressesEqual(contractProduct.beneficiaryAddress, editProduct.beneficiaryAddress))
            ) {
                updateContractProduct(product.id || '', {
                    pricePerSecond: editProduct.pricePerSecond,
                    beneficiaryAddress: editProduct.beneficiaryAddress,
                    ...contractProduct,
                })
                this.contractTransactionStarted = true
            } else if (!this.updateTransactionStarted) {
                // Start the normal API update
                updateProduct()
                this.updateTransactionStarted = true
            }

            // Redirect after successful transaction
            if ((this.contractTransactionStarted &&
                contractTransactionState === transactionStates.CONFIRMED) ||
                (!this.contractTransactionStarted &&
                this.updateTransactionStarted &&
                updateTransactionState === transactionStates.CONFIRMED)
            ) {
                setTimeout(() => {
                    doRedirect(product.id || '', redirectIntent)
                }, 1000)
            }
        }
    }

    render() {
        const {
            walletEnabled,
            product,
            fetchingContractProduct,
            contractProduct,
            contractProductError,
            onCancel,
            contractTransactionState,
            updateTransactionState,
        } = this.props

        if (product) {
            if (!walletEnabled) {
                return <UnlockWalletDialog onCancel={onCancel} />
            }

            // Check that product exists in contract
            if (isPaidProduct(product) && (!contractProduct || (!fetchingContractProduct && contractProductError))) {
                return (
                    <ErrorDialog
                        title={(product && product.name) || ''}
                        message={!!contractProductError && contractProductError.message}
                        waiting={fetchingContractProduct}
                        onDismiss={onCancel}
                    />)
            }

            return (
                <SaveProductDialogComponent
                    transactionState={this.contractTransactionStarted ? contractTransactionState : updateTransactionState}
                    onClose={onCancel}
                />
            )
        }

        return null
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    walletEnabled: selectEnabled(state),
    product: selectProduct(state),
    editProduct: selectEditProduct(state),
    contractProduct: selectContractProduct(state),
    fetchingContractProduct: selectFetchingContractProduct(state),
    contractProductError: selectContractProductError(state),
    contractTransactionState: selectContractTransactionState(state),
    updateTransactionState: selectUpdateTransactionState(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getContractProduct: (id: ProductId) => dispatch(getProductFromContract(id)),
    updateProduct: () => dispatch(updateProductAction()),
    updateContractProduct: (productId: ProductId, product: SmartContractProduct) => dispatch(updateContractProductAction(productId, product)),
    onCancel: () => dispatch(hideModal()),
    doRedirect: (id: ProductId, redirectIntent: string) => {
        dispatch(hideModal())
        if (redirectIntent === redirectIntents.MY_PRODUCTS) {
            dispatch(push(formatPath(links.myProducts)))
        } else {
            dispatch(push(formatPath(links.products, id, 'publish')))
        }
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(SaveProductDialog)
