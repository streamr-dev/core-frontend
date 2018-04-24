// @flow

import React from 'react'

import Dialog from '../Dialog'
import type { TransactionState } from '../../../flowtype/common-types'
import { transactionStates } from '../../../utils/constants'

export type Props = {
    publishState: ?TransactionState,
    onCancel: () => void,
}

const CompletePublishDialog = ({ onCancel, publishState }: Props) => {
    switch (publishState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onCancel}
                    title="Publish product"
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
                        <p>You can wait for it to complete or close this window</p>
                    </div>
                </Dialog>
            )

        case transactionStates.CONFIRMED:
            return (
                <Dialog
                    onClose={onCancel}
                    title="Publish complete"
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

export default CompletePublishDialog
