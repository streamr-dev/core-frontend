// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    onCancel: () => void,
}

const UnlockWalletDialog = ({ onCancel }: Props) => (
    <Dialog
        onClose={onCancel}
        title="Please unlock your wallet"
    >
        ...
    </Dialog>
)

export default UnlockWalletDialog
