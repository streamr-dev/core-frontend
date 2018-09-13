// @flow

import React from 'react'

import UserHeader from '../UserHeader'
import styles from './userCanvasesPage.pcss'

export type Props = {
}

const UserCanvasesPage = () => (
    <div className={styles.userCanvasesPage}>
        <UserHeader />
        <span>User Canvases Page</span>
    </div>
)

export default UserCanvasesPage
