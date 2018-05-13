// @flow

import React, { Component, type ComponentType } from 'react'

type State = {
    error: ?Error,
}

const withErrorBoundary = (ErrorComponent: ComponentType<{}>) => (
    (OriginalComponent: ComponentType<any>) => (
        class ErrorBoundary extends Component<{}, State> {
            state = {
                error: null,
            }

            componentDidCatch(error: Error) {
                console.error(error)
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
