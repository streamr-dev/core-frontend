// @flow

import React from 'react'

import Dialog from '$shared/components/Dialog'
import Modal from '$shared/components/Modal'

type Props = {
    onAccept: Function,
    onReject: Function,
}

const ConfirmDialog = (props: Props) => {
    const { onReject, onAccept } = props
    const actions = {
        cancel: {
            title: 'Cancel',
            onClick: onReject,
        },
        save: {
            title: 'Accept',
            onClick: onAccept,
        },
    }

    return (
        <Modal>
            <Dialog
                onClose={actions.cancel.onClick}
                actions={actions}
            >
                asd
            </Dialog>
        </Modal>
    )
}

export default ConfirmDialog
