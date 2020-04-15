// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

export type Props = {
    onCancel: () => void,
    onSet: () => void | Promise<void>,
    waiting?: boolean,
}

const ConnectEthereumAddressDialog = ({ onCancel, onSet, waiting }: Props) => (
    <ModalPortal>
        <Dialog
            onClose={onCancel}
            title={I18n.t('modal.connectEthereumAddress.title')}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    kind: 'link',
                    onClick: onCancel,
                },
                next: {
                    title: I18n.t('modal.common.next'),
                    outline: true,
                    onClick: () => onSet(),
                    disabled: !!waiting,
                    spinner: !!waiting,
                },
            }}
        >
            <Translate value="modal.connectEthereumAddress.description" dangerousHTML tag="p" />
        </Dialog>
    </ModalPortal>
)

export default ConnectEthereumAddressDialog
