// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import Dialog from '../Dialog'
import withI18n from '$mp/containers/WithI18n'

export type Props = {
    onCancel: () => void,
    onUnpublish: () => void,
    translate: (key: string, options: any) => string,
}

const ReadyToUnpublishDialog = ({ onCancel, onUnpublish, translate }: Props) => (
    <Dialog
        onClose={onCancel}
        title={translate('modal.readyToUnpublish.title')}
        actions={{
            cancel: {
                title: translate('modal.common.cancel'),
                onClick: onCancel,
                color: 'link',
            },
            unpublish: {
                title: translate('modal.readyToUnpublish.unpublish'),
                color: 'primary',
                onClick: onUnpublish,
            },
        }}
    >
        <Translate value="modal.readyToUnpublish.message" dangerousHTML />
    </Dialog>
)

export default withI18n(ReadyToUnpublishDialog)
