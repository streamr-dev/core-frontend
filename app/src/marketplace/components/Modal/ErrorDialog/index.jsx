// @flow

import React, { type Node } from 'react'
import { I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import PngIcon from '$shared/components/PngIcon'

export type Props = {
    title?: string,
    message?: Node,
    waiting?: boolean,
    onClose: () => void,
}

const ErrorDialog = ({ title, message, waiting, onClose }: Props) => (
    <ModalPortal>
        <Dialog
            title={title || I18n.t('modal.errorDialog.defaultTitle')}
            waiting={waiting}
            onClose={onClose}
            actions={{
                dismiss: {
                    title: I18n.t('modal.common.ok'),
                    kind: 'primary',
                    outline: true,
                    onClick: onClose,
                },
            }}
        >
            <PngIcon name="walletError" />
            <p>{message}</p>
        </Dialog>
    </ModalPortal>
)

ErrorDialog.defaultProps = {
    message: null,
    waiting: false,
}

export default ErrorDialog
