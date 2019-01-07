// @flow

import React from 'react'

import { type Props as SessionProps } from '$auth/contexts/Session'

export type DispatchProps = {
    logout: () => void,
}

type Props = DispatchProps & SessionProps & {
}

class LogoutPage extends React.Component<Props> {
    componentDidMount() {
        const { logout, setSessionToken } = this.props

        if (setSessionToken) {
            logout()
            setSessionToken(null)
        }
    }

    render() {
        return null
    }
}

export default LogoutPage
