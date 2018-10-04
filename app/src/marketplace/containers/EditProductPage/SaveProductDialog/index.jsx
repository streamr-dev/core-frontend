// @flow

import React from 'react'
import { connect } from 'react-redux'

import SaveProductDialogComponent from '$mp/components/Modal/SaveProductDialog'
import {
    selectEditProduct,
    selectTransactionState as selectUpdateTransactionState,
} from '$mp/modules/editProduct/selectors'
import { selectUpdateProductTransaction } from '$mp/modules/updateContractProduct/selectors'
import {
    updateContractProduct as updateContractProductAction,
    resetUpdateContractProductTransaction,
} from '$mp/modules/updateContractProduct/actions'
import { selectFetchingContractProduct, selectContractProduct, selectContractProductError } from '$mp/modules/contractProduct/selectors'
import { isUpdateContractProductRequired } from '$mp/utils/smartContract'
import { updateProduct as updateProductAction, resetUpdateProductTransaction } from '$mp/modules/editProduct/actions'
import { hideModal } from '$mp/modules/modals/actions'
import { transactionStates } from '$mp/utils/constants'
import type { StoreState } from '$mp/flowtype/store-state'
import type { ProductId, EditProduct, SmartContractProduct } from '$mp/flowtype/product-types'
import type { TransactionState } from '$mp/flowtype/common-types'
import type { TransactionEntity } from '$mp/flowtype/web3-types'
import withContractProduct from '$mp/containers/WithContractProduct'

type StateProps = {
    editProduct: ?EditProduct, // eslint-disable-line react/no-unused-prop-types
    contractTransaction: ?TransactionEntity,
    updateTransactionState: ?TransactionState,
}

type DispatchProps = {
    updateProduct: () => void, // eslint-disable-line react/no-unused-prop-types
    updateContractProduct: (ProductId, SmartContractProduct) => void, // eslint-disable-line react/no-unused-prop-types
    onCancel: () => void,
    resetUpdateProductTransaction: () => void,
    resetUpdateContractProductTransaction: () => void,
}

type OwnProps = {
    redirect: (ProductId) => void, // eslint-disable-line react/no-unused-prop-types
    contractProduct: ?SmartContractProduct, // eslint-disable-line react/no-unused-prop-types
}

type Props = StateProps & DispatchProps & OwnProps

export class SaveProductDialog extends React.Component<Props> {
    constructor(props: Props) {
        super(props)

        this.startTransaction = this.startTransaction.bind(this)
        this.updateTransactionStarted = false
        this.contractTransactionStarted = false
    }

    componentDidMount() {
        this.props.resetUpdateProductTransaction()
        this.props.resetUpdateContractProductTransaction()
    }

    componentWillReceiveProps(nextProps: Props) {
        this.startTransaction(nextProps)
    }

    updateTransactionStarted: boolean = false
    contractTransactionStarted: boolean = false

    /* :: startTransaction: (Props) => void */
    startTransaction(props: Props) {
        const {
            editProduct,
            updateContractProduct,
            updateProduct,
            contractProduct,
            redirect,
            contractTransaction,
            updateTransactionState,
        } = props
        if (editProduct) {
            // Determine if we need to update price or beneficiaryAddress to contract
            if (contractProduct && !this.contractTransactionStarted &&
                isUpdateContractProductRequired(contractProduct, editProduct)
            ) {
                updateContractProduct(editProduct.id || '', {
                    ...contractProduct,
                    pricePerSecond: editProduct.pricePerSecond,
                    beneficiaryAddress: editProduct.beneficiaryAddress,
                    priceCurrency: editProduct.priceCurrency,
                })
                this.contractTransactionStarted = true
            } else if (!this.updateTransactionStarted) {
                // Start the normal API update
                updateProduct()
                this.updateTransactionStarted = true
            }

            // Redirect after successful transaction
            if ((this.contractTransactionStarted &&
                contractTransaction && contractTransaction.state === transactionStates.CONFIRMED) ||
                (!this.contractTransactionStarted &&
                this.updateTransactionStarted &&
                updateTransactionState === transactionStates.CONFIRMED)
            ) {
                setTimeout(() => {
                    redirect(editProduct.id || '')
                }, 1000)
            }
        }
    }

    render() {
        const { editProduct, onCancel, contractTransaction, updateTransactionState } = this.props

        if (editProduct) {
            if (this.contractTransactionStarted) {
                return (
                    <SaveProductDialogComponent
                        transactionState={contractTransaction ? contractTransaction.state : transactionStates.STARTED}
                        onClose={onCancel}
                    />
                )
            }

            return (
                <SaveProductDialogComponent
                    transactionState={updateTransactionState}
                    onClose={onCancel}
                />
            )
        }

        return null
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    editProduct: selectEditProduct(state),
    contractProduct: selectContractProduct(state),
    fetchingContractProduct: selectFetchingContractProduct(state),
    contractProductError: selectContractProductError(state),
    contractTransaction: selectUpdateProductTransaction(state),
    updateTransactionState: selectUpdateTransactionState(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    updateProduct: () => dispatch(updateProductAction()),
    updateContractProduct: (productId: ProductId, product: SmartContractProduct) => dispatch(updateContractProductAction(productId, product)),
    onCancel: () => dispatch(hideModal()),
    resetUpdateProductTransaction: () => dispatch(resetUpdateProductTransaction()),
    resetUpdateContractProductTransaction: () => dispatch(resetUpdateContractProductTransaction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(SaveProductDialog))
