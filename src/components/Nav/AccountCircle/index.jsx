// @flow

import React from 'react'

import type { User } from '../../../flowtype/user-types'

import styles from './accountCircle.pcss'

type Props = {
    currentUser: ?User,
}

const AccountCircle = ({ currentUser }: Props) => (
    <div className={styles.accountCircle}>
        <span className={styles.inner}>
            {currentUser && currentUser.name[0]}
        </span>
    </div>
)

export default AccountCircle
