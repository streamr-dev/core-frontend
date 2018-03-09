// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'

import styles from './loginpage.pcss'

export type Props = {
    fetching: boolean,
    doLogin: () => void,
}

const LoginPage = ({ fetching, doLogin }: Props) => (
    <div className={styles.loginPage}>
        <div className={styles.loginForm}>
            <p>This will be a login form at some point - click the button to authenticate!</p>

            <Button color="primary" disabled={fetching} onClick={() => !fetching && doLogin()}>
                {!fetching ? 'Login' : 'Logging in...'}
            </Button>
        </div>
    </div>
)

export default LoginPage
