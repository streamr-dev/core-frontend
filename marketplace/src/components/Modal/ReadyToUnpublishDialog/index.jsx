// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    onCancel: () => void,
    onUnpublish: () => void,
}

const ReadyToUnpublishDialog = ({ onCancel, onUnpublish }: Props) => (
    <Dialog
        onClose={onCancel}
        title="Unpublish product"
        actions={{
            cancel: {
                title: 'Cancel',
                onClick: onCancel,
            },
            unpublish: {
                title: 'Unpublish',
                color: 'primary',
                onClick: onUnpublish,
            },
        }}
    >
        Do you want to unpublish this product?
    </Dialog>
)

export default ReadyToUnpublishDialog
