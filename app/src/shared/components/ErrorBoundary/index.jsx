// @flow

import { Component, type Node } from 'react'
import * as Sentry from '@sentry/browser'

type Props = {
    children: Node,
}

type State = {}

class ErrorBoundary extends Component<Props, State> {
    // eslint-disable-next-line class-methods-use-this
    componentDidCatch(error: Error, extra: Object = {}) {
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
