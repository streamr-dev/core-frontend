// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import Avatar from '$shared/components/Avatar'
import DropdownItem from '../DropdownItem'
import Link from '$shared/components/Link'
import routes from '$routes'
import styles from './avatarItem.pcss'

type Props = {
    user: any,
}

const AvatarItem = ({ user }: Props) => (
    <DropdownItem
        to="#"
        label={(
            <Avatar
                alt={user.name}
                className={styles.avatar}
                src={user.imageUrl}
            />
        )}
        align="left"
        eatPadding={false}
    >
        <div className={styles.user}>
            <div className={styles.name}>
                {user.name}
            </div>
            <div className={styles.username}>
                {user.username}
            </div>
        </div>
        {null}
        <Link
            to={routes.editProfile()}
            className={styles.link}
        >
            <Translate value="general.profile" />
        </Link>
        <Link
            to={routes.editProfile({}, 'api-keys')}
            className={styles.link}
        >
            <Translate value="userpages.profilePage.apiCredentials.linkTitle" />
        </Link>
        <Link
            to={routes.editProfile({}, 'ethereum-accounts')}
            className={styles.link}
        >
            <Translate value="userpages.profilePage.ethereumAddress.linkTitle" />
        </Link>
        <Link
            to={routes.editProfile({}, 'private-keys')}
            className={styles.link}
        >
            <Translate value="userpages.profilePage.ethereumPrivateKeys.linkTitle" />
        </Link>
        {null}
        <Link
            to={routes.logout()}
            className={styles.link}
        >
            <Translate value="general.logout" />
        </Link>
    </DropdownItem>
)

export default AvatarItem
