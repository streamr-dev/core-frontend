// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    onCancel: () => void,
    lightBackdrop?: boolean,
    message?: string,
}

const UnlockWalletDialog = ({ onCancel, message, lightBackdrop }: Props) => (
    <Dialog
        onClose={onCancel}
        title="Access your wallet"
        lightBackdrop={lightBackdrop}
    >
        {message && message}
        {!message && '...'}
    </Dialog>
)

export default UnlockWalletDialog
