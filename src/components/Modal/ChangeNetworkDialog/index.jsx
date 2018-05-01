// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    message: string,
    onCancel: () => void,
}

const ChangeNetworkDialog = ({ message, onCancel }: Props) => (
    <Dialog
        onClose={onCancel}
        title="Network"
    >
        {message}
    </Dialog>
)

export default ChangeNetworkDialog
