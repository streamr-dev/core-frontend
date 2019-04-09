// @flow

import React from 'react'
import axios from 'axios'

import ErrorPageView from '$mp/components/ErrorPageView'
import { type Props as SessionProps } from '$auth/contexts/Session'
import { type ErrorInUi } from '$shared/flowtype/common-types'
import routes from '$routes'

export type DispatchProps = {
    logout: () => void,
}

type Props = DispatchProps & SessionProps & {
}

type State = {
    error: ?ErrorInUi,
}

class LogoutPage extends React.Component<Props, State> {
    state = {
        error: null,
    }

    componentDidMount() {
        const { logout, setSessionToken } = this.props

        axios
            .post(routes.externalLogout())
            .then(() => {
                if (setSessionToken) {
                    logout()
                    setSessionToken(null)
                }
            }, (error) => {
                this.setState({
                    error,
                })
            })
    }

    render() {
        return !!this.state.error && (
            <ErrorPageView />
        )
    }
}

export default LogoutPage
