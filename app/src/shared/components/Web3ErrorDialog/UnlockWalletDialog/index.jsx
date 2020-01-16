// @flow

import React, { type Node } from 'react'
import { I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import PngIcon from '$shared/components/PngIcon'

type Props = {
    title?: string,
    onClose: () => void,
    waiting?: boolean,
    children?: Node,
}

const UnlockWalletDialog = ({
    title,
    onClose,
    children,
    waiting,
    ...props
}: Props) => (
    <ModalPortal>
        <Dialog
            {...props}
            onClose={onClose}
            title={!waiting ? title || I18n.t('modal.unlockWallet.title') : I18n.t('modal.unlockWallet.waiting')}
            waiting={waiting}
        >
            <PngIcon name="wallet" />
            {children}
        </Dialog>
    </ModalPortal>
)

export default UnlockWalletDialog
