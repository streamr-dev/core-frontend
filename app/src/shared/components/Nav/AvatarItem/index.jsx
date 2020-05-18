// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import Avatar from '$shared/components/Avatar'
import DropdownItem from '../DropdownItem'
import Link from '$shared/components/Link'
import { isEthereumAddress } from '$mp/utils/validate'
import { truncate } from '$shared/utils/text'
import LinkItem from '../LinkItem'
import routes from '$routes'
import styles from './avatarItem.pcss'

type Props = {
    user: any,
}

const AvatarItem = ({ user }: Props) => {
    const isEthAddress = isEthereumAddress(user.username)

    return (
        <DropdownItem
            toggle={(
                <LinkItem
                    to={routes.profile()}
                >
                    <Avatar
                        alt={user.name}
                        className={styles.avatar}
                        src={user.imageUrlSmall}
                    />
                </LinkItem>
            )}
            align="left"
            eatPadding={false}
        >
            <div className={styles.user}>
                <div className={styles.name}>
                    {user.name}
                </div>
                <div className={styles.username}>
                    {!isEthAddress && (user.username)}
                    {!!isEthAddress && (truncate(user.username, {
                        maxLength: 20,
                    }))}
                </div>
            </div>
            {null}
            <Link
                to={routes.profile()}
                className={styles.link}
            >
                <Translate value="general.profile" />
            </Link>
            <Link
                to={routes.profile({}, 'api-keys')}
                className={styles.link}
            >
                <Translate value="userpages.profilePage.apiCredentials.linkTitle" />
            </Link>
            <Link
                to={routes.profile({}, 'ethereum-accounts')}
                className={styles.link}
            >
                <Translate value="userpages.profilePage.ethereumAddress.linkTitle" />
            </Link>
            <Link
                to={routes.profile({}, 'private-keys')}
                className={styles.link}
            >
                <Translate value="userpages.profilePage.ethereumPrivateKeys.linkTitle" />
            </Link>
            {null}
            <Link
                to={routes.auth.logout()}
                className={styles.link}
            >
                <Translate value="general.logout" />
            </Link>
        </DropdownItem>
    )
}

export default AvatarItem
