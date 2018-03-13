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
            <h1>account</h1>

            <hr />
            <Link to={links.createProduct}>Add product</Link>

            <br /><br />

            <Button color="primary" onClick={() => onLogout()}>Logout</Button>
        </Container>
    </div>
)

export default AccountPage
