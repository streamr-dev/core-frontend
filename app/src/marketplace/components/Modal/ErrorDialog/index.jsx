// @flow

import React, { type Node } from 'react'

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
            title={title || 'Error'}
            waiting={waiting}
            onClose={onClose}
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
