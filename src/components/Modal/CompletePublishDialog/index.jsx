// @flow

import React from 'react'

import Dialog from '../Dialog'
import type { TransactionState } from '../../../flowtype/common-types'
import { transactionStates } from '../../../utils/constants'

export type Props = {
    publishState: ?TransactionState,
}

const CompletePublishDialog = ({ publishState }: Props) => {
    switch (publishState) {
        case transactionStates.STARTED:
            return (
                <Dialog title="Publish product">
                    <div>
                        <p>...</p>
                    </div>
                </Dialog>
            )

        case transactionStates.PENDING:
            return (
                <Dialog title="Writing to the blockchain">
                    <div>
                        <p>Writing...</p>
                        <p>You can wait for it to complete or close this window</p>
                    </div>
                </Dialog>
            )

        case transactionStates.CONFIRMED:
            return (
                <Dialog title="Publish complete">
                    <div>
                        <p>Done!</p>
                    </div>
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog title="Error">
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
