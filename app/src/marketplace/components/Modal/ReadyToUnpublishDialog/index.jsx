// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'

export type Props = {
    onCancel: () => void,
    onContinue: () => void,
}

const ReadyToUnpublishDialog = ({ onCancel, onContinue }: Props) => (
    <Dialog
        onClose={onCancel}
        title={I18n.t('modal.readyToUnpublish.title')}
        actions={{
            cancel: {
                title: I18n.t('modal.common.cancel'),
                onClick: onCancel,
                color: 'link',
            },
            unpublish: {
                title: I18n.t('modal.readyToUnpublish.unpublish'),
                color: 'primary',
                onClick: onContinue,
            },
        }}
    >
        <Translate value="modal.readyToUnpublish.message" dangerousHTML />
    </Dialog>
)

export default ReadyToUnpublishDialog
