// @flow

import React from 'react'

import UserHeader from '../UserHeader'
import styles from './userProductsPage.pcss'

export type Props = {
}

const UserProductsPage = () => (
    <div className={styles.userProductsPage}>
        <UserHeader />
        <span>User Products Page</span>
    </div>
)

export default UserProductsPage
