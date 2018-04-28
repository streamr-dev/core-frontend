// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    onClose: () => void,
}

const ApproveTransactionDialog = ({ onClose }: Props) => (
    <Dialog
        title="Updating"
        onClose={onClose}
    >
        Please approve the transaction to edit the product&apos;s price.
    </Dialog>
)

export default ApproveTransactionDialog
