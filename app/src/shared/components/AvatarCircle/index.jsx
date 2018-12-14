// @flow

import React from 'react'
import cx from 'classnames'

import type { User } from '$shared/flowtype/user-types'
import FallbackImage from '$shared/components/FallbackImage'

import styles from './avatarCircle.pcss'

type Props = {
    user: ?User,
    className?: string,
}

const AccountCircle = ({ user, className }: Props) => (
    <div className={cx(styles.accountCircle, className)}>
        <span className={styles.inner}>
            {user && user.name[0]}
        </span>
    </div>
)

const AvatarCircle = ({ user, className }: Props) => (
    <div>
        <FallbackImage
            className={cx(styles.accountCircle, className)}
            src={(user && user.imageUrl) || ''}
            alt={(user && user.name) || ''}
            placeholder={<AccountCircle user={user} className={className} />}
        />
    </div>
)

export default AvatarCircle
