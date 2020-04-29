// @flow

import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import { Link } from 'react-router-dom'

import { updatePassword } from '$shared/modules/user/actions'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import routes from '$routes'
import Button from '$shared/components/Button'
import Label from '$ui/Label'
import Text from '$ui/Text'
import Errors from '$ui/Errors'
import usePasswordStrength, { StrengthMessage } from '$shared/hooks/usePasswordStrength'
import useModal from '$shared/hooks/useModal'
import { usePending } from '$shared/hooks/usePending'

import type { PasswordUpdate } from '$shared/flowtype/user-types'
import styles from './changePassword.pcss'

type ComponentProps = {
    onClose: () => void,
    onSave: (PasswordUpdate) => void | Promise<void>,
    waiting?: boolean,
}

export const ChangePasswordDialogComponent = ({ onSave, onClose, waiting }: ComponentProps) => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const passwordStrength = usePasswordStrength(newPassword)
    const strongEnoughPassword = !!(passwordStrength > 1)

    const newPasswordGiven = !!newPassword && !!confirmNewPassword
    const passwordsMatch = newPassword === confirmNewPassword
    const allPasswordsGiven = !!currentPassword && !!newPassword && !!confirmNewPassword

    const onChangeCurrentPassword = useCallback(({ target }: SyntheticInputEvent<HTMLInputElement>) => {
        setCurrentPassword(target.value)
    }, [])
    const onChangeNewPassword = useCallback(({ target }: SyntheticInputEvent<HTMLInputElement>) => {
        setNewPassword(target.value)
    }, [])
    const onChangeConfirmNewPassword = useCallback(({ target }: SyntheticInputEvent<HTMLInputElement>) => {
        setConfirmNewPassword(target.value)
    }, [])

    return (
        <ModalPortal>
            <Dialog
                className={styles.dialogContainerOverride}
                contentClassName={styles.content}
                title={I18n.t('modal.changePassword.defaultTitle')}
                onClose={onClose}
                renderActions={() => (
                    <div className={styles.footer}>
                        <div className={styles.footerText}>
                            <Link
                                to={routes.forgotPassword({
                                    from: 'profile',
                                })}
                                className={styles.forgotLink}
                            >
                                <Translate value="modal.changePassword.forgotPassword.mobile" className={styles.forgotLinkTextMobile} />
                                <Translate value="modal.changePassword.forgotPassword.desktop" className={styles.forgotLinkTextDesktop} />
                            </Link>
                        </div>
                        <Button
                            type="button"
                            kind="link"
                            onClick={() => onClose()}
                            className={styles.cancelButton}
                        >
                            {I18n.t('modal.common.cancel')}
                        </Button>
                        <Button
                            type="button"
                            kind="primary"
                            onClick={() => onSave({
                                currentPassword,
                                newPassword,
                                confirmNewPassword,
                            })}
                            disabled={!allPasswordsGiven || !passwordsMatch || !strongEnoughPassword || waiting}
                            waiting={waiting}
                            className={styles.saveButton}
                        >
                            {I18n.t('modal.common.save')}
                        </Button>
                    </div>
                )}
            >
                <div className={styles.currentPassword}>
                    <Label htmlFor="currentPassword">
                        {I18n.t('modal.changePassword.currentPassword')}
                    </Label>
                    <Text
                        id="currentPassword"
                        type="password"
                        name="currentPassword"
                        value={currentPassword || ''}
                        onChange={onChangeCurrentPassword}
                        required
                        disabled={waiting}
                    />
                    <Errors />
                </div>
                <div className={styles.newPassword}>
                    <Label htmlFor="newPassword">
                        {passwordStrength !== -1 ? (
                            <StrengthMessage strength={passwordStrength} />
                        ) : (
                            I18n.t('modal.changePassword.newPassword')
                        )}
                    </Label>
                    <Text
                        id="newPassword"
                        type="password"
                        name="newPassword"
                        value={newPassword || ''}
                        onChange={onChangeNewPassword}
                        required
                        autoComplete="off"
                        disabled={waiting}
                    />
                    <Errors />
                </div>
                <div className={styles.confirmNewPassword}>
                    <Label htmlFor="confirmNewPassword">
                        {I18n.t('modal.changePassword.confirmNewPassword')}
                    </Label>
                    <Text
                        id="confirmNewPassword"
                        type="password"
                        name="confirmNewPassword"
                        value={confirmNewPassword || ''}
                        onChange={onChangeConfirmNewPassword}
                        required
                        autoComplete="off"
                        disabled={waiting}
                    />
                    <Errors>
                        {newPasswordGiven && !passwordsMatch && I18n.t('modal.changePassword.passwordsDoNotMatch')}
                    </Errors>
                </div>
            </Dialog>
        </ModalPortal>
    )
}

type Props = {
    api: Object,
}

const ChangePasswordDialog = ({ api }: Props) => {
    const dispatch = useDispatch()
    const { wrap, isPending } = usePending('user.CHANGE_PASSWORD')

    const onSave = useCallback(async (update: PasswordUpdate) => (
        wrap(async () => {
            let changed = false
            let error

            try {
                await dispatch(updatePassword(update))
                changed = true
            } catch (e) {
                console.warn(e)
                error = e
            } finally {
                api.close({
                    changed,
                    error,
                })
            }
        })
    ), [wrap, dispatch, api])

    const onClose = useCallback(() => {
        api.close({
            changed: false,
            error: undefined,
        })
    }, [api])

    return (
        <ChangePasswordDialogComponent
            onSave={onSave}
            onClose={onClose}
            waiting={isPending}
        />
    )
}

export default () => {
    const { api, isOpen } = useModal('userpages.changePassword')

    if (!isOpen) {
        return null
    }

    return (
        <ChangePasswordDialog
            api={api}
        />
    )
}
