// @flow

import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment-timezone'
import Select from 'react-select'
import { Form, Input, FormGroup, Label, InputGroup, Button } from 'reactstrap'
// TODO: This css file doesnt exist in the dist folder, leaving it out for now.
// import 'react-select/dist/react-select.css'

import { getCurrentUser, updateCurrentUserName, updateCurrentUserTimezone, saveCurrentUser } from '../../../modules/user/actions'

import type { UserState } from '../../../flowtype/states/user-state'
import type { User } from '../../../flowtype/user-types'

import links from '../../../../links'

type StateProps = {
    user: ?User
}

type DispatchProps = {
    getCurrentUser: () => void,
    updateCurrentUserName: (name: $ElementType<User, 'name'>) => void,
    updateCurrentUserTimezone: (timezone: $ElementType<User, 'timezone'>) => void,
    saveCurrentUser: (user: User) => void
}

type Props = StateProps & DispatchProps

export class ProfileSettings extends Component<Props> {
    componentDidMount() {
        // TODO: move to (yet nonexistent) router
        this.props.getCurrentUser()
    }

    onNameChange = ({ target }: { target: { value: $ElementType<User, 'name'> } }) => {
        this.props.updateCurrentUserName(target.value)
    }

    // eslint-disable-next-line react/no-unused-prop-types
    onTimezoneChange = ({ value }: { value: $ElementType<User, 'timezone'> }) => {
        this.props.updateCurrentUserTimezone(value)
    }

    onSubmit = (e: Event) => {
        e.preventDefault()
        if (this.props.user) {
            this.props.saveCurrentUser(this.props.user)
        }
    }

    render() {
        const options = moment.tz.names().map((tz) => ({
            value: tz,
            label: tz,
        }))
        return (
            <Fragment>
                <h1>Profile Settings</h1>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label>
                            Email
                        </Label>
                        <div>{this.props.user && this.props.user.username}</div>
                    </FormGroup>
                    <FormGroup>
                        <Label>
                            Password
                        </Label>
                        <div>
                            <Link to={links.profileChangePassword}>
                                Change Password
                            </Link>
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label>
                            Full Name
                        </Label>
                        <Input
                            name="name"
                            value={this.props.user ? this.props.user.name : ''}
                            onChange={this.onNameChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>
                            Timezone
                        </Label>
                        <Select
                            placeholder="Select timezone"
                            options={options}
                            value={this.props.user && {
                                timezone: this.props.user.timezone, // TODO: check this still works as expected. Value must be an object not a string
                            }}
                            name="timezone"
                            onChange={this.onTimezoneChange}
                            required
                            clearable={false}
                        />
                    </FormGroup>
                    <FormGroup>
                        <InputGroup>
                            <Button
                                type="submit"
                                name="submit"
                                color="primary"
                                size="lg"
                            >
                                Save
                            </Button>
                        </InputGroup>
                    </FormGroup>
                </Form>
            </Fragment>
        )
    }
}

export const mapStateToProps = ({ user }: { user: UserState }): StateProps => ({
    user: user.currentUser,
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getCurrentUser() {
        dispatch(getCurrentUser())
    },
    updateCurrentUserName(name: $ElementType<User, 'name'>) {
        dispatch(updateCurrentUserName(name))
    },
    updateCurrentUserTimezone(tz: $ElementType<User, 'timezone'>) {
        dispatch(updateCurrentUserTimezone(tz))
    },
    saveCurrentUser(user: User) {
        dispatch(saveCurrentUser(user))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings)
