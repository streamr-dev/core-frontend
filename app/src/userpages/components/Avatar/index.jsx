// @flow

import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import AvatarUpload from './AvatarUpload'
import NameAndEmail from './NameAndEmail'
import AvatarCircle from '$shared/components/AvatarCircle'
import type { User } from '$shared/flowtype/user-types'

import styles from './avatar.pcss'
import links from '$shared/../links'

type Props = {
    user: User,
    editable?: boolean,
    className?: string,
    linkToProfile?: boolean,
    onImageChange?: (?File) => Promise<void>,
}

const Avatar = ({
    user,
    editable,
    className,
    linkToProfile,
    onImageChange,
}: Props) => (
    <div className={cx(className, styles.container)}>
        {!!linkToProfile && (
            <Link to={links.userpages.profile} className={styles.avatarLink}>
                <AvatarCircle name={user.name} imageUrl={user.imageUrlLarge} className={styles.avatarCircle} />
            </Link>
        )}
        {!linkToProfile && (
            <AvatarCircle name={user.name} imageUrl={user.imageUrlLarge} className={styles.avatarCircle} uploadAvatarPlaceholder />
        )}
        {!editable && (
            <NameAndEmail name={user.name} username={user.username} showBalance />
        )}
        {editable && onImageChange && (
            <AvatarUpload onImageChange={onImageChange} image={(user && user.imageUrlLarge) || ''} />
        )}
    </div>
)

export default Avatar
