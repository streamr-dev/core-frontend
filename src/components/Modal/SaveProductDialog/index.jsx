// @flow

import React from 'react'

import Dialog from '../Dialog'
import type { TransactionState } from '../../../flowtype/common-types'
import { transactionStates } from '../../../utils/constants'

export type Props = {
    transactionState: ?TransactionState,
    onClose: () => void,
}

const SaveProductDialog = ({ transactionState, onClose }: Props) => {
    switch (transactionState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onClose}
                    title="Updating"
                >
                    <div>
                        <p>...</p>
                    </div>
                </Dialog>
            )

        case transactionStates.PENDING:
            return (
                <Dialog
                    onClose={onClose}
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
                    onClose={onClose}
                    title="Update complete"
                >
                    <div>
                        <p>Done!</p>
                    </div>
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog
                    onClose={onClose}
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

export default SaveProductDialog
