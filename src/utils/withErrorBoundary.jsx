// @flow

import React, { Component, type ComponentType } from 'react'
import Raven from 'raven-js'

type State = {
    error: ?Error,
}

const withErrorBoundary = (ErrorComponent: ComponentType<{}>) => (
    (OriginalComponent: ComponentType<any>) => (
        class ErrorBoundary extends Component<{}, State> {
            state = {
                error: null,
            }

            componentDidCatch(error: Error, errorInfo: string) {
                console.error(error)
                Raven.captureException(error, {
                    extra: errorInfo,
                })
                this.setState({
                    error,
                })
            }

            render() {
                const { error } = this.state
                return error ? (
                    <ErrorComponent />
                ) : (
                    <OriginalComponent {...this.props} />
                )
            }
        }
    )
)

export default withErrorBoundary
