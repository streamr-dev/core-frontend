// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    onCancel: () => void,
}

const AlreadyPurchasedDialog = ({ onCancel }: Props) => (
    <Dialog
        onClose={onCancel}
        title="Already purchased"
    >
        You already have a subscription for this product
    </Dialog>
)

export default AlreadyPurchasedDialog
