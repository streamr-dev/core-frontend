// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    message: string,
    onCancel: () => void,
    lightBackdrop?: boolean,
}

const ChangeNetworkDialog = ({ message, onCancel, lightBackdrop }: Props) => (
    <Dialog
        onClose={onCancel}
        title="Network"
        lightBackdrop={lightBackdrop}
    >
        {message}
    </Dialog>
)

export default ChangeNetworkDialog
