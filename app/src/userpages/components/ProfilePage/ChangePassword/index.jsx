// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import { Link } from 'react-router-dom'

import { updatePassword } from '$shared/modules/user/actions'
import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import TextInput from '$shared/components/TextInput'
import routes from '$routes'
import Button from '$shared/components/Button'

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
}

class ChangePasswordDialog extends Component<Props, State> {
    state = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        updating: false,
        strongEnoughPassword: false,
    }

    handlePasswordStrengthChange = (passwordStrength: number) => {
        this.setState({
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
        } = this.state
        const newPasswordGiven = !!newPassword && !!confirmNewPassword
        const passWordsMatch = newPassword === confirmNewPassword
        const allPasswordsGiven = !!currentPassword && !!newPassword && !!confirmNewPassword

        return (
            <Modal>
                <Dialog
                    className={styles.dialogContainerOverride}
                    contentClassName={styles.content}
                    title={I18n.t('modal.changePassword.defaultTitle')}
                    onClose={this.props.onToggle}
                    actions={{
                        cancel: {
                            title: I18n.t('modal.common.cancel'),
                            outline: true,
                            kind: 'link',
                            onClick: this.props.onToggle,
                        },
                        save: {
                            title: I18n.t('modal.common.save'),
                            kind: 'primary',
                            onClick: this.onSubmit,
                            disabled: !allPasswordsGiven || !passWordsMatch || !strongEnoughPassword || updating,
                            spinner: updating,
                        },
                    }}
                >
                    <Link to={routes.forgotPassword()} className={styles.forgotLink}>
                        <Translate value="modal.changePassword.forgotPassword" />
                    </Link>
                    <div className={styles.currentPassword}>
                        <TextInput
                            label={I18n.t('modal.changePassword.currentPassword')}
                            type="password"
                            name="currentPassword"
                            value={currentPassword || ''}
                            onChange={this.onChange('currentPassword')}
                            required
                        />
                    </div>
                    <div className={styles.newPassword}>
                        <TextInput
                            label={I18n.t('modal.changePassword.newPassword')}
                            type="password"
                            name="newPassword"
                            value={newPassword || ''}
                            onChange={this.onChange('newPassword')}
                            measureStrength
                            required
                            passwordStrengthUpdate={this.handlePasswordStrengthChange}
                        />
                    </div>
                    <div className={styles.confirmNewPassword}>
                        <TextInput
                            label={I18n.t('modal.changePassword.confirmNewPassword')}
                            type="password"
                            name="confirmNewPassword"
                            value={confirmNewPassword || ''}
                            onChange={this.onChange('confirmNewPassword')}
                            error={(newPasswordGiven && !passWordsMatch) ? I18n.t('modal.changePassword.passwordsDoNotMatch') : undefined}
                            preserveErrorSpace
                            required
                        />
                    </div>
                </Dialog>
            </Modal>
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

export { ChangePasswordButton as Button }
