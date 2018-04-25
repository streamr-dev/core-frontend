// @flow

import React from 'react'
import type { Match } from 'react-router-dom'

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
        return null
    }
}

export default LoginPage
