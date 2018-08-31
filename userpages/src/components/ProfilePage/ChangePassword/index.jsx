// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, FormGroup, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import 'react-select/dist/react-select.css'

import { updatePassword } from '../../../modules/user/actions'

import type { PasswordUpdate } from '../../../flowtype/actions/user-actions'

type StateProps = {}

type DispatchProps = {
    updatePassword: (update: PasswordUpdate) => any
}

type Props = StateProps & DispatchProps & {
    isOpen: boolean,
    onToggle: Function,
}

type State = PasswordUpdate

class ChangePasswordModalComponent extends Component<Props, State> {
    state = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    }

    onSubmit = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        const update = this.props.updatePassword(this.state)
        if (update.then) {
            update.then(() => {
                this.props.onToggle(false)
            })
        }
    }

    onChange = (name: string) => ({ target }: SyntheticInputEvent<HTMLInputElement>) => {
        this.setState({
            [name]: target.value,
        })
    }

    render() {
        return (
            <Modal id="changePassword" isOpen={this.props.isOpen} toggle={this.props.onToggle}>
                {!!this.props.isOpen && (
                    <React.Fragment>
                        <ModalHeader>
                            Change Password
                        </ModalHeader>
                        <ModalBody>
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    <Label>
                                        Current Password
                                    </Label>
                                    <Input
                                        type="password"
                                        autoComplete="current-password"
                                        name="currentPassword"
                                        value={this.state.currentPassword || ''}
                                        onChange={this.onChange('currentPassword')}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>
                                        New Password
                                    </Label>
                                    <Input
                                        type="password"
                                        autoComplete="new-password"
                                        name="newPassword"
                                        value={this.state.newPassword || ''}
                                        onChange={this.onChange('newPassword')}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        type="password"
                                        autoComplete="new-password"
                                        name="confirmNewPassword"
                                        value={this.state.confirmNewPassword || ''}
                                        onChange={this.onChange('confirmNewPassword')}
                                        required
                                    />
                                </FormGroup>
                                <ModalFooter>
                                    <Button
                                        type="reset"
                                        name="cancel"
                                        size="lg"
                                        onClick={() => this.props.onToggle(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        name="submit"
                                        color="primary"
                                        size="lg"
                                    >
                                        Save
                                    </Button>
                                </ModalFooter>
                            </Form>
                        </ModalBody>
                    </React.Fragment>
                )}
            </Modal>
        )
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
                    color="secondary"
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
