// @flow

import React, { Component, type ComponentType } from 'react'
import Raven from 'raven-js'

type Props = {
    path?: string,
}
type State = {
    error: ?Error,
}

const withErrorBoundary = (ErrorComponent: ComponentType<{}>) => (
    (OriginalComponent: ComponentType<any>) => (
        class ErrorBoundary extends Component<Props, State> {
            state = {
                error: null,
            }

            componentWillReceiveProps(nextProps: Props) {
                // Reset error state if route changes, otherwise error is always shown.
                if (this.props.path !== nextProps.path) {
                    this.setState({
                        error: null,
                    })
                }
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
