// @flow

import React, { type Node } from 'react'

import Dialog from '../Dialog'

export type Props = {
    title?: string,
    message?: Node,
    waiting?: boolean,
    onDismiss: () => void,
}

const ErrorDialog = ({ title, message, waiting, onDismiss }: Props) => (
    <Dialog
        title={title}
        waiting={waiting}
        actions={{
            dismiss: {
                title: 'OK',
                color: 'primary',
                onClick: onDismiss,
            },
        }}
    >
        {message}
    </Dialog>
)

ErrorDialog.defaultProps = {
    title: 'Error',
    message: null,
    waiting: false,
}

export default ErrorDialog
