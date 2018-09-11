// @flow

import React from 'react'

import UserHeader from '../UserHeader'
import styles from './userStreamsPage.pcss'

export type Props = {
}

const UserStreamsPage = () => (
    <div className={styles.userStreamsPage}>
        <UserHeader />
        <span>User Streams Page</span>
    </div>
)

export default UserStreamsPage
