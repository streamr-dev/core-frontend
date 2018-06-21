// @flow

import React, { type Node } from 'react'

import Dialog from '../Dialog'
import withI18n from '../../../containers/WithI18n'

export type Props = {
    title?: string,
    message?: Node,
    waiting?: boolean,
    onDismiss: () => void,
    translate: (key: string, options: any) => string,
}

const ErrorDialog = ({
    title,
    message,
    waiting,
    onDismiss,
    translate,
}: Props) => (
    <Dialog
        title={title || translate('modal.errorDialog.defaultTitle')}
        waiting={waiting}
        onClose={onDismiss}
        actions={{
            dismiss: {
                title: translate('modal.common.ok'),
                color: 'primary',
                onClick: onDismiss,
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

export default withI18n(ErrorDialog)
