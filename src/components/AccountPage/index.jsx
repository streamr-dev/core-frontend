// @flow

import React from 'react'
import { Container, Button } from '@streamr/streamr-layout'

import styles from './accountpage.pcss'

export type Props = {
    onLogout: () => void,
}

const AccountPage = ({ onLogout }: Props) => (
    <div className={styles.accountPage}>
        <Container>
            <h1>account</h1>

            <Button color="primary" onClick={() => onLogout()}>Logout</Button>
        </Container>
    </div>
)

export default AccountPage
