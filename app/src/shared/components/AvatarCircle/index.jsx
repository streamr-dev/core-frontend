// @flow

import React from 'react'
import cx from 'classnames'

import type { User } from '$shared/flowtype/user-types'

import styles from './avatarCircle.pcss'

type Props = {
    user: ?User,
    className?: string,
}

const AvatarCircle = ({ user, className }: Props) => (
    <div className={cx(styles.accountCircle, className)}>
        <span className={styles.inner}>
            {user && user.name[0]}
        </span>
    </div>
)

export default AvatarCircle
