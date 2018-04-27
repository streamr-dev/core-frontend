// @flow

import React from 'react'

import Dialog from '../Dialog'
import type { TransactionState } from '../../../flowtype/common-types'
import { transactionStates } from '../../../utils/constants'

export type Props = {
    purchaseState: ?TransactionState,
    onCancel: () => void,
}

const CompletePurchaseDialog = ({ onCancel, purchaseState }: Props) => {
    switch (purchaseState) {
        case transactionStates.PENDING:
            return (
                <Dialog
                    onClose={onCancel}
                    title="Writing to the blockchain"
                >
                    <div>
                        <p>Writing...</p>
                        <p>You can wait for it to complete or close this window</p>
                    </div>
                </Dialog>
            )

        case transactionStates.CONFIRMED:
            return (
                <Dialog
                    onClose={onCancel}
                    title="Transaction complete"
                >
                    <div>
                        <p>Done!</p>
                        <p>Please sign in or Sign up to view your purchase</p>
                    </div>
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog
                    onClose={onCancel}
                    title="Error"
                >
                    <div>
                        <p>Oops...</p>
                        <p>Something went wrong :(</p>
                    </div>
                </Dialog>
            )

        default:
            return null
    }
}

export default CompletePurchaseDialog
