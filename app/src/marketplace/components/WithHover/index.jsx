// @flow

import React, { Component, type ComponentType } from 'react'

export type State = {
    isHovered: boolean,
}

export function withHover(WrappedComponent: ComponentType<any>) {
    return class WithHover extends Component<{}, State> {
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
                <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                    <WrappedComponent isHovered={this.state.isHovered} {...this.props} />
                </div>
            )
        }
    }
}
