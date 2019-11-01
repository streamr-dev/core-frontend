// @flow

import React, { Component, type ComponentType, type Node } from 'react'

import analytics from '../../analytics'

type Props = {
    path?: string,
    children?: ?Node,
}
type State = {
    error: ?Error,
}

const withErrorBoundary = (ErrorComponent: ComponentType<any>) => (
    (OriginalComponent: ComponentType<any>) => (
        class ErrorBoundary extends Component<Props, State> {
            state = {
                error: undefined,
            }

            static getDerivedStateFromError(error: Error, extra: any) {
                console.error({
                    error,
                })
                analytics.reportError(error, extra)
                // Reset error state if route changes, otherwise error is always shown.
                return {
                    error,
                }
            }

            componentDidUpdate(prevProps: Props) {
                // Reset error state if route changes, otherwise error is always shown.
                if (this.props.path !== prevProps.path) {
                    // eslint-disable-next-line react/no-did-update-set-state
                    this.setState({
                        error: undefined,
                    })
                }
            }

            render() {
                const { error } = this.state
                const { children, ...props } = this.props
                return error ? (
                    <ErrorComponent {...props} error={this.state.error} />
                ) : (
                    <OriginalComponent {...props}>
                        {children}
                    </OriginalComponent>
                )
            }
        }
    )
)

export default withErrorBoundary
