// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import NameAndUsername from './NameAndUsername'
import AvatarCircle from '$shared/components/AvatarCircle'
import type { User } from '$shared/flowtype/user-types'

import styles from './avatar.pcss'
import routes from '$routes'

type Props = {
    user: User,
    className?: string,
    linkToProfile?: boolean,
    children?: Node,
}

const Avatar = ({ user, className, linkToProfile, children }: Props) => (
    <div className={cx(className, styles.container)}>
        {!!linkToProfile && (
            <Link to={routes.profile()} className={styles.avatarLink}>
                <AvatarCircle name={user.name} imageUrl={user.imageUrlLarge} className={styles.avatarCircle} />
            </Link>
        )}
        {!linkToProfile && (
            <AvatarCircle name={user.name} imageUrl={user.imageUrlLarge} className={styles.avatarCircle} uploadAvatarPlaceholder />
        )}
        <NameAndUsername name={user.name} username={user.username}>
            {children}
        </NameAndUsername>
    </div>
)

export default Avatar
