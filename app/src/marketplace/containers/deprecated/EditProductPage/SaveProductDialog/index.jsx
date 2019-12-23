// @flow

import React from 'react'
import { connect } from 'react-redux'

import ModalPortal from '$shared/components/ModalPortal'
import SaveProductDialogComponent from '$mp/components/deprecated/SaveProductDialog'
import SaveContractProductDialogComponent from '$mp/components/Modal/SaveContractProductDialog'
import { selectTransactionState as selectUpdateTransactionState } from '$mp/modules/deprecated/editProduct/selectors'
import { selectUpdateProductTransaction, selectUpdateContractProductError } from '$mp/modules/updateContractProduct/selectors'
import { saveProduct, resetSaveDialog } from '$mp/modules/deprecated/saveProductDialog/actions'
import { saveProductSteps } from '$mp/utils/constants'
import { transactionStates } from '$shared/utils/constants'
import type { SaveProductStep } from '$mp/flowtype/store-state'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ProductId } from '$mp/flowtype/product-types'
import type { TransactionState, ErrorInUi } from '$shared/flowtype/common-types'
import type { TransactionEntity } from '$shared/flowtype/web3-types'
import withContractProduct from '$mp/containers/deprecated/WithContractProduct'
import { selectStep, selectUpdateFinished } from '$mp/modules/deprecated/saveProductDialog/selectors'

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
}

type OwnProps = {
    redirect: (ProductId) => void, // eslint-disable-line react/no-unused-prop-types
    productId: ProductId,
    onClose: () => void,
}

type Props = StateProps & DispatchProps & OwnProps

export class SaveProductDialog extends React.Component<Props> {
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

    onClose = () => {
        const { resetSaveDialog: resetDialog, onClose } = this.props
        resetDialog()
        onClose()
    }

    redirectStarted: boolean = false

    dialog() {
        const { step, contractUpdateError, contractTransaction, updateTransactionState } = this.props

        switch (step) {
            case saveProductSteps.STARTED: {
                return (
                    <SaveProductDialogComponent
                        transactionState={transactionStates.STARTED}
                        onClose={this.onClose}
                    />
                )
            }

            case saveProductSteps.SAVE: {
                return (
                    <SaveProductDialogComponent
                        transactionState={updateTransactionState}
                        onClose={this.onClose}
                    />
                )
            }

            case saveProductSteps.TRANSACTION: {
                // If the user cancels the transaction, the error won't be automatically detected.
                // We need to check the error object here for that.
                const transactionState: string = (contractUpdateError && transactionStates.FAILED) ||
                    (contractTransaction && contractTransaction.state) ||
                    transactionStates.STARTED

                return (
                    <SaveContractProductDialogComponent
                        transactionState={transactionState}
                        onClose={this.onClose}
                    />
                )
            }

            default:
                return null
        }
    }

    render() {
        const dialog = this.dialog()
        return dialog && <ModalPortal>{dialog}</ModalPortal>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(SaveProductDialog))
