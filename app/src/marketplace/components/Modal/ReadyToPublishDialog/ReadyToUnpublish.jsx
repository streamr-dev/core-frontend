// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

import type { BaseProps as Props } from '.'

const ReadyToUnpublishDialog = ({ onCancel, onContinue }: Props) => (
    <ModalPortal>
        <Dialog
            onClose={onCancel}
            title={I18n.t('modal.readyToUnpublish.title')}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    onClick: () => onCancel(),
                    kind: 'link',
                },
                unpublish: {
                    title: I18n.t('modal.readyToUnpublish.unpublish'),
                    kind: 'primary',
                    onClick: () => onContinue(),
                },
            }}
        >
            <Translate value="modal.readyToUnpublish.message" dangerousHTML />
        </Dialog>
    </ModalPortal>
)

export default ReadyToUnpublishDialog
