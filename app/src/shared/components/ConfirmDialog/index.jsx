// @flow

import React, { type Node, useState } from 'react'
import { Translate } from 'react-redux-i18n'
import cx from 'classnames'
import { Label, FormGroup } from 'reactstrap'

import type { Kind } from '$shared/components/Button'

import Dialog from '$shared/components/Dialog'
import ModalPortal from '$shared/components/ModalPortal'
import Buttons from '$shared/components/Buttons'
import Checkbox from '$shared/components/Checkbox'

import styles from './confirmDialog.pcss'

type Button = string | {
    title: string,
    kind?: Kind,
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

    const cancelButtonProps: Object = (typeof cancelButton === 'object') ? {
        ...cancelButton,
    } : {
        ...(cancelButton ? {
            title: cancelButton,
        } : {}),
    }

    const acceptButtonProps: Object = (typeof acceptButton === 'object') ? {
        ...acceptButton,
    } : {
        ...(acceptButton ? {
            title: acceptButton,
        } : {}),
    }

    const actions = {
        cancel: {
            title: 'Cancel',
            onClick: onReject,
            kind: 'link',
            outline: true,
            ...cancelButtonProps,
        },
        save: {
            title: 'OK',
            onClick: (event) => onAccept(event, checked),
            kind: 'primary',
            ...acceptButtonProps,
        },
    }

    return (
        <ModalPortal>
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
                                            value={checked}
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
        </ModalPortal>
    )
}

export default ConfirmDialog
