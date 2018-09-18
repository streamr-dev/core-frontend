// @flow

import React from 'react'
import { Translate } from 'streamr-layout/dist/bundle'

import Dialog from '../Dialog/index'
import withI18n from '../../../../../../marketplace/src/containers/WithI18n/index'

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
