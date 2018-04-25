// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    onClose: () => void,
    onContinue: () => void,
}

const ConfirmNoCoverImageDialog = ({ onClose, onContinue }: Props) => (
    <Dialog
        title="No cover image set"
        onClose={onClose}
        actions={{
            cancel: {
                title: 'Cancel',
                onClick: onClose,
            },
            continue: {
                title: 'Continue',
                color: 'primary',
                onClick: () => {
                    onContinue()
                    onClose()
                },
            },
        }}
    >
        Product has no cover image. Are you sure you want to save it without cover image?
    </Dialog>
)

export default ConfirmNoCoverImageDialog
