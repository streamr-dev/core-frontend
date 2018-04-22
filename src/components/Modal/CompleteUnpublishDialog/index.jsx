// @flow

import React from 'react'

import Dialog from '../Dialog'
import type { TransactionState } from '../../../flowtype/common-types'
import { transactionStates } from '../../../utils/constants'

export type Props = {
    publishState: ?TransactionState,
    onCancel: () => void,
}

const CompleteUnpublishDialog = ({ onCancel, publishState }: Props) => {
    switch (publishState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onCancel}
                    title="Unpublish product"
                >
                    <div>
                        <p>...</p>
                    </div>
                </Dialog>
            )

        case transactionStates.PENDING:
            return (
                <Dialog
                    onClose={onCancel}
                    title="Writing to the blockchain"
                >
                    <div>
                        <p>Writing...</p>
                    </div>
                </Dialog>
            )

        case transactionStates.CONFIRMED:
            return (
                <Dialog
                    onClose={onCancel}
                    title="Unpublish complete"
                >
                    <div>
                        <p>Done!</p>
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

export default CompleteUnpublishDialog
