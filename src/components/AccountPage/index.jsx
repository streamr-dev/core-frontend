// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Button } from '@streamr/streamr-layout'

import styles from './accountpage.pcss'
import links from '../../links.json'

export type Props = {
    onLogout: () => void,
}

const AccountPage = ({ onLogout }: Props) => (
    <div className={styles.accountPage}>
        <Container>
            <h1>Account</h1>

            <Link to={links.myProducts}>My Products</Link>

            <div className={styles.logout}>
                <Button color="primary" onClick={() => onLogout()}>Logout</Button>
            </div>
        </Container>
    </div>
)

export default AccountPage
