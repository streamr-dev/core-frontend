// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

export type Props = {
    onCancel: () => void,
    productLink: string,
}

const UnpublishComplete = ({ onCancel, productLink }: Props) => (
    <ModalPortal>
        <Dialog
            onClose={onCancel}
            title={I18n.t('modal.unpublishComplete.title')}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.close'),
                    onClick: () => onCancel(),
                    kind: 'primary',
                },
            }}
        >
            <Translate
                value="modal.unpublishComplete.message"
                dangerousHTML
                tag="p"
                productLink={productLink}
            />
        </Dialog>
    </ModalPortal>
)

export default UnpublishComplete
