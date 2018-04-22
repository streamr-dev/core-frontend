// @flow

import React from 'react'

import Dialog from '../Modal/Dialog'
import ModalDialog from '../ModalDialog'

export type Props = {
    onClose: () => void,
    onContinue: () => void,
}

const ConfirmNoCoverImageDialog = ({ onClose, onContinue }: Props) => (
    <ModalDialog onClose={onClose} >
        <Dialog
            title="No cover image set"
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
    </ModalDialog>
)

export default ConfirmNoCoverImageDialog
