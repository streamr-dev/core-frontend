// @flow

import React from 'react'
import type { Match } from 'react-router-dom'

export type Props = {
    match: Match,
    endExternalLogin: () => void,
}

class LoginPage extends React.Component<Props> {
    componentDidMount() {
        const { match, endExternalLogin } = this.props

        if (match.params.type === 'external') {
            // After ending the external login 'redux-auth-wrapper'
            // picks up the query parameter 'redirect' and redirects
            // to given page automatically.
            endExternalLogin()
        }
    }

    render() {
        return null
    }
}

export default LoginPage
