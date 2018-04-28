// @flow

import React from 'react'

import Dialog from '../Dialog'

export type Props = {
    closeOnContinue: boolean,
    onClose: () => void,
    onContinue: () => void,
}

const ConfirmNoCoverImageDialog = ({ closeOnContinue, onClose, onContinue }: Props) => (
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

                    if (closeOnContinue) {
                        onClose()
                    }
                },
            },
        }}
    >
        Product has no cover image. Are you sure you want to save it without cover image?
    </Dialog>
)

ConfirmNoCoverImageDialog.defaultProps = {
    closeOnContinue: true,
}

export default ConfirmNoCoverImageDialog
