// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'

import styles from './loginpage.pcss'

export type Props = {
    doLogin: () => void,
}

const LoginPage = ({ doLogin }: Props) => (
    <div className={styles.loginPage}>
        <div className={styles.loginForm}>
            <p>This will be a login form at some point - click the button to authenticate!</p>

            <Button color="primary" onClick={() => doLogin()}>Login</Button>
        </div>
    </div>
)

export default LoginPage
