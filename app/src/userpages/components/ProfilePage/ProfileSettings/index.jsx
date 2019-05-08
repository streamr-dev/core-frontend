// @flow

import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment-timezone'

import TextInput from '$shared/components/TextInput'
import SelectInput from '$shared/components/SelectInput'

import {
    updateCurrentUserName,
    updateCurrentUserTimezone,
    updateCurrentUserImage,
    getUserData,
} from '$shared/modules/user/actions'

import type { StoreState } from '$shared/flowtype/store-state'
import { selectUserData } from '$shared/modules/user/selectors'
import type { User } from '$shared/flowtype/user-types'
import Avatar from '$userpages/components/Avatar'

import * as ChangePassword from '../ChangePassword'
import styles from './profileSettings.pcss'

type StateProps = {
    user: ?User
}

type DispatchProps = {
    getCurrentUser: () => void,
    updateCurrentUserName: (name: $ElementType<User, 'name'>) => void,
    updateCurrentUserTimezone: (timezone: $ElementType<User, 'timezone'>) => void,
    updateCurrentUserImage: (image: ?File) => Promise<void>,
}

type Props = StateProps & DispatchProps

const options = moment.tz.names().map((tz) => ({
    value: tz,
    label: `(UTC${moment.tz(tz).format('Z')}) ${tz}`.replace(/\//g, ', ').replace(/_/g, ' '),
}))

export class ProfileSettings extends Component<Props> {
    componentDidMount() {
        // TODO: move to (yet nonexistent) router
        this.props.getCurrentUser()
    }

    onNameChange = ({ target }: { target: { value: $ElementType<User, 'name'> } }) => {
        this.props.updateCurrentUserName(target.value)
    }

    onTimezoneChange = ({ value }: { value: $ElementType<User, 'timezone'> }) => {
        this.props.updateCurrentUserTimezone(value)
    }

    onImageChange = (image: ?File) => (
        this.props.updateCurrentUserImage(image)
    )

    render() {
        const user = this.props.user || {
            email: '',
            name: '',
            username: null,
            timezone: null,
        }
        return (
            <Fragment>
                <Avatar
                    className={styles.avatar}
                    editable
                    // $FlowFixMe
                    user={user}
                    onImageChange={this.onImageChange}
                />
                <div className={styles.fullname}>
                    <TextInput
                        label="Your Name"
                        name="name"
                        value={user.name || ''}
                        onChange={this.onNameChange}
                        required
                        preserveLabelSpace
                    />
                </div>
                <div className={styles.email}>
                    <TextInput label="Email" value={user.username || ''} readOnly />
                </div>
                <div className={styles.password}>
                    <ChangePassword.Button />
                </div>
                <div className={styles.timezone}>
                    <SelectInput
                        label="Timezone"
                        name="name"
                        options={options}
                        value={options.find(({ value }) => user.timezone === value)}
                        onChange={this.onTimezoneChange}
                        required
                        className={styles.timezoneInput}
                    />
                </div>
            </Fragment>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    user: selectUserData(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getCurrentUser() {
        dispatch(getUserData())
    },
    updateCurrentUserName(name: $ElementType<User, 'name'>) {
        dispatch(updateCurrentUserName(name))
    },
    updateCurrentUserTimezone(tz: $ElementType<User, 'timezone'>) {
        dispatch(updateCurrentUserTimezone(tz))
    },
    updateCurrentUserImage(image: ?File) {
        return dispatch(updateCurrentUserImage(image))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings)
