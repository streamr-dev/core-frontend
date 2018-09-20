// @flow

import React from 'react'

import UserHeader from '../UserHeader'
import styles from './userDashboardsPage.pcss'

export type Props = {
}

const UserDashboardsPage = () => (
    <div className={styles.userDashboardsPage}>
        <UserHeader />
        <span>User Dashboard Page</span>
    </div>
)

export default UserDashboardsPage
