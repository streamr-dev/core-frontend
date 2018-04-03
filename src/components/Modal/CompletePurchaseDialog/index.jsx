// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    waiting: boolean,
}

const CompletePurchaseDialog = ({ waiting }: Props) => (
    <Dialog
        title={waiting ? 'Writing to the blockchain' : 'Transaction complete'}
    >
        {!waiting && (
            <div>
                Done!
            </div>
        )}
        {waiting && (
            <div>
                <p>Writing...</p>
                <p>You can wait for it to complete or close this window</p>
            </div>
        )}
        <div>
            Please sign in or Sign up to view your purchase
        </div>
    </Dialog>
)

CompletePurchaseDialog.defaultProps = {
    waiting: false,
}

export default CompletePurchaseDialog
