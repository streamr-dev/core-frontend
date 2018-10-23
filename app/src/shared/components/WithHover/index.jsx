import React, { Component } from 'react'

export function withHover(WrappedComponent) {
    return class WithHover extends Component {
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
