// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import AvatarCircle from '$shared/components/AvatarCircle'
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
            <AvatarCircle
                name={user.name}
                imageUrl={user.imageUrl}
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
