// @flow

import React, { type Node } from 'react'
import { I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import PngIcon, { type PngIconName } from '$shared/components/PngIcon'

type Props = {
    title?: string,
    onClose: () => void,
    waiting?: boolean,
    children?: Node,
    icon?: PngIconName,
}

const UnlockWalletDialog = ({
    title,
    onClose,
    children,
    waiting,
    icon = 'wallet',
    ...props
}: Props) => (
    <ModalPortal>
        <Dialog
            {...props}
            onClose={onClose}
            title={!waiting ? title || I18n.t('modal.unlockWallet.title') : I18n.t('modal.unlockWallet.waiting')}
            waiting={waiting}
            actions={{
                ok: {
                    title: I18n.t('modal.common.ok'),
                    onClick: () => onClose(),
                    kind: 'primary',
                    outline: true,
                },
            }}
        >
            <PngIcon name={icon} />
            {children}
        </Dialog>
    </ModalPortal>
)

export default UnlockWalletDialog
