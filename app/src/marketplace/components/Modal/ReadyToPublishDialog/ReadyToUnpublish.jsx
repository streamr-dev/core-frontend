// @flow

import React from 'react'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

import type { BaseProps as Props } from '.'

const ReadyToUnpublishDialog = ({ onCancel, onContinue, disabled }: Props) => (
    <ModalPortal>
        <Dialog
            onClose={onCancel}
            title="Unpublish product"
            disabled={disabled}
            actions={{
                cancel: {
                    title: 'Cancel',
                    onClick: () => onCancel(),
                    kind: 'link',
                },
                unpublish: {
                    title: 'Unpublish',
                    kind: 'primary',
                    onClick: () => onContinue(),
                },
            }}
        >
            <p>
                Do you want to unpublish this product?
            </p>
        </Dialog>
    </ModalPortal>
)

export default ReadyToUnpublishDialog
