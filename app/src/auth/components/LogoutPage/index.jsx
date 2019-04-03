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

        /*
         * TODO(Mariusz): At this point there's no official token-invalidating
         * API endpoint for logout. The following request is a placeholder. Once
         * we do have the endpoint let's update externalLogout route.
         */
        axios
            .get(routes.externalLogout())
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
