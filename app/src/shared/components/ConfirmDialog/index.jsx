// @flow

import React, { type Node } from 'react'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import Dialog from '$shared/components/Dialog'
import Modal from '$shared/components/Modal'

import styles from './confirmDialog.pcss'

type Button = string | {
    title: string,
    color?: 'outline' | 'primary' | 'danger',
    disabled?: boolean,
    spinner?: boolean,
}

export type Properties = {
    title?: string,
    message: Node,
    acceptButton?: Button,
    cancelButton?: Button,
    centerButtons?: boolean,
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
        centerButtons,
        onReject,
        onAccept,
    } = props

    const cancelButtonProps = (typeof cancelButton === 'object') ? {
        ...cancelButton,
    } : {
        ...(cancelButton ? {
            title: cancelButton,
        } : {}),
    }

    const acceptButtonProps = (typeof acceptButton === 'object') ? {
        ...acceptButton,
    } : {
        ...(acceptButton ? {
            title: acceptButton,
        } : {}),
    }

    const actions = {
        cancel: {
            title: I18n.t('modal.common.cancel'),
            onClick: onReject,
            outline: true,
            ...cancelButtonProps,
        },
        save: {
            title: I18n.t('modal.common.ok'),
            onClick: onAccept,
            color: 'primary',
            ...acceptButtonProps,
        },
    }

    return (
        <Modal>
            <Dialog
                actionsClassName={cx({
                    [styles.centerButtons]: !!centerButtons,
                })}
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
