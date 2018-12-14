// @flow

import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import AvatarUpload from './AvatarUpload'
import NameAndEmail from './NameAndEmail'
import AvatarCircle from '$shared/components/AvatarCircle'
import type { User } from '$shared/flowtype/user-types'
import type { UploadedFile } from '$shared/flowtype/common-types'

import styles from './avatar.pcss'
import links from '$shared/../links'

type Props = {
    user: User,
    editable?: boolean,
    className?: string,
    linkToProfile?: boolean,
    onImageChange?: (?UploadedFile) => void,
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
                <AvatarCircle user={user} className={styles.avatarCircle} />
            </Link>
        )}
        {!linkToProfile && (
            <AvatarCircle user={user} className={styles.avatarCircle} />
        )}
        {!editable && (
            <NameAndEmail name={user.name} email={user.username} />
        )}
        {editable && onImageChange && (
            <AvatarUpload onImageChange={onImageChange} image={(user && user.imageUrl) || ''} />
        )}
    </div>
)

export default Avatar
