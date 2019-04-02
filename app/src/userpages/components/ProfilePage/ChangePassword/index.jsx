// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { I18n, Translate } from 'react-redux-i18n'

import { updatePassword } from '$shared/modules/user/actions'
import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import TextInput from '$shared/components/TextInput'
import routes from '$routes'

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
}

class ChangePasswordDialog extends Component<Props, State> {
    state = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        updating: false,
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
        const { currentPassword, newPassword, confirmNewPassword, updating } = this.state
        const newPasswordGiven = !!newPassword && !!confirmNewPassword
        const passWordsMatch = newPassword === confirmNewPassword
        const allPasswordsGiven = !!currentPassword && !!newPassword && !!confirmNewPassword

        return (
            <Modal>
                <Dialog
                    contentClassName={styles.content}
                    title={I18n.t('modal.changePassword.defaultTitle')}
                    onClose={this.props.onToggle}
                    actions={{
                        cancel: {
                            title: I18n.t('modal.common.cancel'),
                            outline: true,
                            color: 'link',
                            onClick: this.props.onToggle,
                        },
                        save: {
                            title: I18n.t('modal.common.save'),
                            color: 'primary',
                            onClick: this.onSubmit,
                            disabled: !allPasswordsGiven || !passWordsMatch || updating,
                            spinner: updating,
                        },
                    }}
                >
                    <a href={routes.oldForgotPassword()} className={styles.forgotLink}>
                        <Translate value="modal.changePassword.forgotPassword" />
                    </a>
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
                    outline
                    type="button"
                    color="userpages"
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
