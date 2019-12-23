// @flow

import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'

import TextInput from '$shared/components/TextInput'

import {
    updateCurrentUserName,
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
    updateCurrentUserImage: (image: ?File) => Promise<void>,
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

    onImageChange = (image: ?File) => (
        this.props.updateCurrentUserImage(image)
    )

    render() {
        const user = this.props.user || {
            email: '',
            name: '',
            username: '',
            imageUrlSmall: '',
            imageUrlLarge: '',
        }

        return (
            <Fragment>
                <Avatar
                    className={styles.avatar}
                    editable
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
                    <TextInput
                        label="Email"
                        value={user.username || ''}
                        readOnly
                        preserveLabelSpace
                    />
                </div>
                <div className={styles.password}>
                    <ChangePassword.Button />
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
    updateCurrentUserImage(image: ?File) {
        return dispatch(updateCurrentUserImage(image))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings)
