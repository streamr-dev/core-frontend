import React, { useState, ReactNode, ChangeEvent } from 'react'
import cx from 'classnames'
import { Label, FormGroup } from 'reactstrap'
import { Kind } from '$shared/components/Button'
import Dialog from '$shared/components/Dialog'
import ModalPortal from '$shared/components/ModalPortal'
import Buttons from '$shared/components/Buttons'
import Checkbox from '$shared/components/Checkbox'
import styles from './confirmDialog.pcss'
type Button =
    | string
    | {
          title: string
          kind?: Kind
          disabled?: boolean
          spinner?: boolean
      }
export type Properties = {
    title?: string
    message: ReactNode
    acceptButton?: Button
    cancelButton?: Button
    centerButtons?: boolean
    dontShowAgain?: boolean
}
type Actions = {
    onAccept: (...args: Array<any>) => any
    onReject: (...args: Array<any>) => any
}
type Props = Properties & Actions

const ConfirmDialog = (props: Props) => {
    const [checked, setChecked] = useState(false)
    const { title, message, acceptButton, cancelButton, centerButtons, dontShowAgain, onReject, onAccept } = props
    const cancelButtonProps: Record<string, any> =
        typeof cancelButton === 'object'
            ? { ...cancelButton }
            : {
                ...(cancelButton
                    ? {
                        title: cancelButton,
                    }
                    : {}),
            }
    const acceptButtonProps: Record<string, any> =
        typeof acceptButton === 'object'
            ? { ...acceptButton }
            : {
                ...(acceptButton
                    ? {
                        title: acceptButton,
                    }
                    : {}),
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
            onClick: (event: any) => onAccept(event, checked),
            kind: 'primary',
            ...acceptButtonProps,
        },
    }
    return (
        <ModalPortal>
            <Dialog
                title={title}
                onClose={actions.cancel.onClick}
                actions={actions as any}
                renderActions={() => (
                    <div
                        className={cx(styles.footer, {
                            [styles.dontShowAgainFooter]: !!dontShowAgain,
                        })}
                    >
                        {!!dontShowAgain && (
                            <div
                                className={cx({
                                    [styles.dontShowAgain]: !!dontShowAgain,
                                })}
                            >
                                <FormGroup check className={styles.formGroup}>
                                    <Label check className={styles.label}>
                                        <Checkbox
                                            value={checked}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                setChecked(e.target.checked)
                                            }}
                                        />
                                        <span>Don&apos;t show this again</span>
                                    </Label>
                                </FormGroup>
                            </div>
                        )}
                        <Buttons
                            className={cx({
                                [styles.centerButtons]: !!centerButtons,
                            })}
                            actions={actions as any}
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
