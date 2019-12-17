// @flow

import React, { type Node } from 'react'
import { I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'

export type Props = {
    title?: string,
    message?: Node,
    waiting?: boolean,
    onClose: () => void,
}

const ErrorDialog = ({ title, message, waiting, onClose }: Props) => (
    <Dialog
        title={title || I18n.t('modal.errorDialog.defaultTitle')}
        waiting={waiting}
        onClose={onClose}
        actions={{
            dismiss: {
                title: I18n.t('modal.common.ok'),
                kind: 'primary',
                onClick: onClose,
            },
        }}
    >
        {message}
    </Dialog>
)

ErrorDialog.defaultProps = {
    message: null,
    waiting: false,
}

export default ErrorDialog
