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

            componentDidCatch(error: Error, extra: any) {
                console.error(error)
                analytics.reportError(error, extra)
                this.setState({
                    error,
                })
            }

            render() {
                const { error } = this.state
                const { children, ...props } = this.props
                return error ? (
                    <ErrorComponent {...props} error={this.state} />
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
