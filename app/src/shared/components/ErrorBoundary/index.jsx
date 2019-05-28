// @flow

import { Component } from 'react'
import * as Sentry from '@sentry/browser'

// import isProduction from '$mp/utils/isProduction'

type Props = {
    children: any,
}

type State = {}

class ErrorBoundary extends Component<Props, State> {
    static componentDidCatch(error: Error, extra: Object = {}) {
        Sentry.withScope((scope) => {
            if (extra) {
                scope.setExtras(extra)
            }
            Sentry.captureException(error)
        })
    }

    render() {
        const { children } = this.props
        return children
    }
}

export default ErrorBoundary
