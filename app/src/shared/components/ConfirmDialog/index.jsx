// @flow

import React, { type Node, useState } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import cx from 'classnames'
import { Label, FormGroup } from 'reactstrap'

import Dialog from '$shared/components/Dialog'
import Modal from '$shared/components/Modal'
import Buttons from '$shared/components/Buttons'
import Checkbox from '$shared/components/Checkbox'

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
    dontShowAgain?: boolean,
}

type Actions = {
    onAccept: Function,
    onReject: Function,
}

type Props = Properties & Actions

const ConfirmDialog = (props: Props) => {
    const [checked, setChecked] = useState(false)
    const {
        title,
        message,
        acceptButton,
        cancelButton,
        centerButtons,
        dontShowAgain,
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
            color: 'link',
            outline: true,
            ...cancelButtonProps,
        },
        save: {
            title: I18n.t('modal.common.ok'),
            onClick: (event) => onAccept(event, checked),
            color: 'primary',
            ...acceptButtonProps,
        },
    }

    return (
        <Modal>
            <Dialog
                title={title}
                onClose={actions.cancel.onClick}
                actions={actions}
                renderActions={() => (
                    <div className={cx(styles.footer, {
                        [styles.dontShowAgainFooter]: !!dontShowAgain,
                    })}
                    >
                        {!!dontShowAgain && (
                            <div className={cx({
                                [styles.dontShowAgain]: !!dontShowAgain,
                            })}
                            >
                                <FormGroup check className={styles.formGroup}>
                                    <Label check className={styles.label}>
                                        <Checkbox
                                            checked={checked}
                                            onChange={(e) => {
                                                setChecked(e.target.checked)
                                            }}
                                        />
                                        <Translate value="modal.confirm.dontShowAgain" />
                                    </Label>
                                </FormGroup>
                            </div>
                        )}
                        <Buttons
                            className={cx({
                                [styles.centerButtons]: !!centerButtons,
                            })}
                            actions={actions}
                        />
                    </div>
                )}
            >
                {message}
            </Dialog>
        </Modal>
    )
}

export default ConfirmDialog
