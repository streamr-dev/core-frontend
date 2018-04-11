// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    onCancel: () => void,
}

const ReadyToPublishDialog = ({ onCancel }: Props) => (
    <Dialog
        title="Publish your product"
        actions={{
            cancel: {
                title: 'Cancel',
                onClick: onCancel,
            },
            next: {
                title: 'Publish',
                color: 'primary',
                onClick: () => {},
            },
        }}
    >
        <p>You are about to add your product to the Marketplace.</p>
        <p>Are you all ready to go?</p>
    </Dialog>
)

export default ReadyToPublishDialog
