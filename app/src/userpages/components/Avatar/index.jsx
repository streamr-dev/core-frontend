// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import AvatarUpload from './AvatarUpload'
import NameAndUsername from './NameAndUsername'
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
    children?: Node,
    disabled?: boolean,
}

const Avatar = ({
    user,
    editable,
    className,
    linkToProfile,
    onImageChange,
    children,
    disabled,
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
            <NameAndUsername name={user.name} username={user.username}>
                {children}
            </NameAndUsername>
        )}
        {editable && onImageChange && (
            <AvatarUpload
                onImageChange={onImageChange}
                image={(user && user.imageUrlLarge) || ''}
                disabled={disabled}
            />
        )}
    </div>
)

export default Avatar
