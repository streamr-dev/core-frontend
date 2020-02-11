// @flow

import React, { Component, useEffect } from 'react'
import { connect } from 'react-redux'
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

import type { PasswordUpdate } from '$shared/flowtype/user-types'
import styles from './changePassword.pcss'

type StateProps = {}

type DispatchProps = {
    updatePassword: (update: PasswordUpdate) => any
}

type Props = StateProps & DispatchProps & {
    isOpen: boolean,
    onToggle: Function,
}

type State = PasswordUpdate & {
    updating: boolean,
    strongEnoughPassword: boolean,
    passwordStrength: number,
}

type PasswordStrengthMeterProps = {
    password: string,
    onChange: (number) => void,
}

const PasswordStrengthMeter = ({ password, onChange }: PasswordStrengthMeterProps) => {
    const strength = usePasswordStrength(password)

    useEffect(() => {
        onChange(strength)
    }, [strength, onChange])

    return null
}

class ChangePasswordDialog extends Component<Props, State> {
    state = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        updating: false,
        strongEnoughPassword: false,
        passwordStrength: -1,
    }

    handlePasswordStrengthChange = (passwordStrength: number) => {
        this.setState({
            passwordStrength,
            strongEnoughPassword: passwordStrength > 1,
        })
    }

    onSubmit = () => {
        const update = this.props.updatePassword(this.state)
        this.setState({
            updating: true,
        })
        if (update.then) {
            update.then(() => {
                this.setState({
                    updating: false,
                }, () => {
                    this.props.onToggle(false)
                })
            }, (e) => {
                console.error(e)
                this.setState({
                    updating: false,
                })
            })
        }
    }

    onChange = (name: string) => ({ target }: SyntheticInputEvent<HTMLInputElement>) => {
        this.setState({
            [name]: target.value,
        })
    }

    render() {
        const {
            currentPassword,
            newPassword,
            confirmNewPassword,
            updating,
            strongEnoughPassword,
            passwordStrength,
        } = this.state
        const newPasswordGiven = !!newPassword && !!confirmNewPassword
        const passWordsMatch = newPassword === confirmNewPassword
        const allPasswordsGiven = !!currentPassword && !!newPassword && !!confirmNewPassword

        return (
            <ModalPortal>
                <PasswordStrengthMeter
                    password={newPassword}
                    onChange={this.handlePasswordStrengthChange}
                />
                <Dialog
                    className={styles.dialogContainerOverride}
                    contentClassName={styles.content}
                    title={I18n.t('modal.changePassword.defaultTitle')}
                    onClose={this.props.onToggle}
                    renderActions={() => (
                        <div className={styles.footer}>
                            <div className={styles.footerText}>
                                <Link to={routes.forgotPassword()} className={styles.forgotLink}>
                                    <Translate value="modal.changePassword.forgotPassword.mobile" className={styles.forgotLinkTextMobile} />
                                    <Translate value="modal.changePassword.forgotPassword.desktop" className={styles.forgotLinkTextDesktop} />
                                </Link>
                            </div>
                            <Button
                                type="button"
                                kind="link"
                                onClick={() => this.props.onToggle()}
                                className={styles.cancelButton}
                            >
                                {I18n.t('modal.common.cancel')}
                            </Button>
                            <Button
                                type="button"
                                kind="primary"
                                onClick={this.onSubmit}
                                disabled={!allPasswordsGiven || !passWordsMatch || !strongEnoughPassword || updating}
                                waiting={updating}
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
                            onChange={this.onChange('currentPassword')}
                            required
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
                            onChange={this.onChange('newPassword')}
                            required
                            autoComplete="off"
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
                            onChange={this.onChange('confirmNewPassword')}
                            required
                            autoComplete="off"
                        />
                        <Errors>
                            {newPasswordGiven && !passWordsMatch && I18n.t('modal.changePassword.passwordsDoNotMatch')}
                        </Errors>
                    </div>
                </Dialog>
            </ModalPortal>
        )
    }
}

class ChangePasswordModalComponent extends Component<Props> {
    render() {
        const { isOpen, onToggle, ...props } = this.props

        if (isOpen) {
            return <ChangePasswordDialog isOpen onToggle={onToggle} {...props} />
        }

        return null
    }
}

const mapDispatchToProps = (dispatch): DispatchProps => ({
    updatePassword(update: PasswordUpdate): any {
        return dispatch(updatePassword(update))
    },
})

const ChangePasswordModal = connect(null, mapDispatchToProps)(ChangePasswordModalComponent)

type TriggerProps = {}

type TriggerState = {
    isOpen: boolean,
}

class ChangePasswordButton extends React.Component<TriggerProps, TriggerState> {
    state = {
        isOpen: false,
    }

    onToggle = (value: any) => {
        this.setState(({ isOpen }) => {
            if (typeof value === 'boolean') {
                if (value === isOpen) {
                    return null // no change
                }
                return {
                    isOpen: value,
                }
            }
            return {
                isOpen: !isOpen,
            }
        })
    }

    render() {
        return (
            <React.Fragment>
                <Button
                    kind="secondary"
                    className={styles.changePassword}
                    onClick={this.onToggle}
                    aria-label="Change Password"
                >
                    Change Password
                </Button>
                <ChangePasswordModal
                    onToggle={this.onToggle}
                    isOpen={this.state.isOpen}
                />
            </React.Fragment>
        )
    }
}

export {
    ChangePasswordDialog,
    ChangePasswordButton as Button,
}
