// @flow

import React from 'react'
import { connect } from 'react-redux'

import SaveProductDialogComponent from '$mp/components/Modal/SaveProductDialog'
import SaveContractProductDialogComponent from '$mp/components/Modal/SaveContractProductDialog'
import { selectTransactionState as selectUpdateTransactionState } from '$mp/modules/editProduct/selectors'
import { selectUpdateProductTransaction, selectUpdateContractProductError } from '$mp/modules/updateContractProduct/selectors'
import { saveProduct, resetSaveDialog } from '$mp/modules/saveProductDialog/actions'
import { hideModal } from '$mp/modules/modals/actions'
import { saveProductSteps } from '$mp/utils/constants'
import { transactionStates } from '$shared/utils/constants'
import type { SaveProductStep } from '$mp/flowtype/store-state'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ProductId } from '$mp/flowtype/product-types'
import type { TransactionState, ErrorInUi } from '$shared/flowtype/common-types'
import type { TransactionEntity } from '$shared/flowtype/web3-types'
import withContractProduct from '$mp/containers/WithContractProduct'
import { selectStep, selectUpdateFinished } from '$mp/modules/saveProductDialog/selectors'

type StateProps = {
    step: SaveProductStep,
    updateFinished: boolean,
    contractUpdateError: ?ErrorInUi,
    contractTransaction: ?TransactionEntity,
    updateTransactionState: ?TransactionState,
}

type DispatchProps = {
    resetSaveDialog: () => void,
    saveProduct: () => void, // eslint-disable-line react/no-unused-prop-types
    onCancel: () => void,
}

type OwnProps = {
    redirect: (ProductId) => void, // eslint-disable-line react/no-unused-prop-types
    productId: ProductId,
}

type Props = StateProps & DispatchProps & OwnProps

export class SaveProductDialog extends React.Component<Props> {
    constructor(props: Props) {
        super(props)

        this.redirectStarted = false
    }

    componentDidMount() {
        this.props.resetSaveDialog()
        this.props.saveProduct()
    }

    componentWillReceiveProps(nextProps: Props) {
        const { updateFinished, productId, redirect } = nextProps

        if (updateFinished && !this.redirectStarted) {
            this.redirectStarted = true

            setTimeout(() => {
                redirect(productId)
                this.props.resetSaveDialog()
            }, 1000)
        }
    }

    redirectStarted: boolean

    render() {
        const {
            step,
            contractUpdateError,
            contractTransaction,
            updateTransactionState,
            onCancel,
        } = this.props

        switch (step) {
            case saveProductSteps.STARTED: {
                return (
                    <SaveProductDialogComponent
                        transactionState={transactionStates.STARTED}
                        onClose={onCancel}
                    />
                )
            }

            case saveProductSteps.SAVE: {
                return (
                    <SaveProductDialogComponent
                        transactionState={updateTransactionState}
                        onClose={onCancel}
                    />
                )
            }

            case saveProductSteps.TRANSACTION: {
                let transactionState = transactionStates.STARTED

                // If the user cancels the transaction, the error won't be automatically detected.
                // We need to check the error object here for that.
                if (contractUpdateError) {
                    transactionState = transactionStates.FAILED
                } else if (contractTransaction) {
                    transactionState = contractTransaction.state
                }

                return (
                    <SaveContractProductDialogComponent
                        transactionState={transactionState}
                        onClose={onCancel}
                    />
                )
            }

            default:
                return null
        }
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    step: selectStep(state),
    updateFinished: selectUpdateFinished(state),
    contractUpdateError: selectUpdateContractProductError(state),
    contractTransaction: selectUpdateProductTransaction(state),
    updateTransactionState: selectUpdateTransactionState(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    resetSaveDialog: () => dispatch(resetSaveDialog()),
    saveProduct: () => dispatch(saveProduct()),
    onCancel: () => {
        dispatch(resetSaveDialog())
        dispatch(hideModal())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(SaveProductDialog))
