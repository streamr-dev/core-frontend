import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

export function withHover(WrappedComponent) {
    class WithHover extends Component {
        state = {
            isHovered: false,
        }

        onMouseEnter = () => {
            this.setState({
                isHovered: true,
            })
        }

        onMouseLeave = () => {
            this.setState({
                isHovered: false,
            })
        }

        render() {
            return (
                <div
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                >
                    <WrappedComponent isHovered={this.state.isHovered} {...this.props} />
                </div>
            )
        }
    }
    // Preserve static properties
    hoistNonReactStatics(WithHover, WrappedComponent)
    return WithHover
}
