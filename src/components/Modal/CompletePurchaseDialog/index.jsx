// @flow

import React from 'react'

import Dialog from '../Dialog'
import type { TransactionState } from '../../../flowtype/common-types'
import { transactionStates } from '../../../utils/constants'

export type Props = {
    purchaseState: ?TransactionState,
}

const CompletePurchaseDialog = ({ purchaseState }: Props) => {
    switch (purchaseState) {
        case transactionStates.HASH_RECEIVED:
            return (
                <Dialog title="Writing to the blockchain">
                    <div>
                        <p>Writing...</p>
                        <p>You can wait for it to complete or close this window</p>
                    </div>
                </Dialog>
            )

        case transactionStates.MINED:
            return (
                <Dialog title="Transaction complete">
                    <div>
                        <p>Done!</p>
                        <p>Please sign in or Sign up to view your purchase</p>
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

export default CompletePurchaseDialog
