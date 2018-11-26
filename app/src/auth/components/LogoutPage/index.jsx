// @flow

import React from 'react'

import ErrorPageView from '$mp/components/ErrorPageView'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type StateProps = {
    error: ?ErrorInUi,
}

export type DispatchProps = {
    logout: () => void,
}

type Props = DispatchProps & StateProps & {
}

class LogoutPage extends React.Component<Props> {
    componentDidMount() {
        this.props.logout()
    }

    render() {
        return !!this.props.error && (
            <ErrorPageView />
        )
    }
}

export default LogoutPage
