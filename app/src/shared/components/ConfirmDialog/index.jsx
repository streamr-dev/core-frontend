// @flow

import React, { type Node } from 'react'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import Dialog from '$shared/components/Dialog'
import Modal from '$shared/components/Modal'

import styles from './confirmDialog.pcss'

export type Properties = {
    title?: string,
    message: Node,
    acceptButton?: string,
    cancelButton?: string,
    danger?: boolean,
}

type Actions = {
    onAccept: Function,
    onReject: Function,
}

type Props = Properties & Actions

const ConfirmDialog = (props: Props) => {
    const {
        title,
        message,
        acceptButton,
        cancelButton,
        onReject,
        onAccept,
        danger,
    } = props

    const actions = {
        cancel: {
            title: acceptButton || I18n.t('modal.common.cancel'),
            onClick: onReject,
        },
        save: {
            title: cancelButton || I18n.t('modal.common.ok'),
            onClick: onAccept,
            className: cx(styles.saveButton, {
                [styles.danger]: danger,
            }),
            color: 'primary',
        },
    }

    return (
        <Modal>
            <Dialog
                title={title}
                onClose={actions.cancel.onClick}
                actions={actions}
            >
                {message}
            </Dialog>
        </Modal>
    )
}

export default ConfirmDialog
