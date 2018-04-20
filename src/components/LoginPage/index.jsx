// @flow

import React from 'react'
import type { Match } from 'react-router-dom'

import styles from './loginpage.pcss'

export type Props = {
    match: Match,
    endExternalLogin: () => void,
}

class LoginPage extends React.Component<Props> {
    componentDidMount() {
        if (this.props.match.params.type === 'external') {
            this.props.endExternalLogin()
            // After ending the external login 'redux-auth-wrapper'
            // picks up the query parameter 'redirect' and redirects
            // to given page automatically.
        }
    }

    render() {
        return (
            <div className={styles.loginPage}>
                <div className={styles.loginForm}>
                    <p>This is the page receiving external login redirect</p>
                </div>
            </div>
        )
    }
}

export default LoginPage
