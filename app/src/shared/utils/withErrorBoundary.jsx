// @flow

import React, { Component, type ComponentType, type Node } from 'react'
import { Helmet } from 'react-helmet'

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
                const errorMessage = 'Error – '
                const title = document.title.startsWith(errorMessage) ? document.title : `${errorMessage}${document.title}`
                return error ? (
                    <React.Fragment>
                        <Helmet title={title} />
                        <ErrorComponent {...props} error={this.state} />
                    </React.Fragment>
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
