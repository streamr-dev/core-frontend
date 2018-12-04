// @flow

import { PureComponent, type Node } from 'react'

import zxcvbn from '$utils/zxcvbn'

type Props = {
    children?: (number) => Node,
    enabled?: boolean,
    value?: string,
}

type State = {
    strength: number,
}

class PasswordStrength extends PureComponent<Props, State> {
    state = {
        strength: -1,
    }

    componentDidMount() {
        this.measure()
    }

    componentDidUpdate() {
        this.measure()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    unmounted: boolean

    async measure() {
        const { enabled, value } = this.props
        const strength: number = enabled && value ? [0, 1, 1, 2, 2][(await zxcvbn())(value || '').score] : -1

        if (!this.unmounted) {
            this.setState({
                strength,
            })
        }
    }

    render() {
        const { children } = this.props
        return children ? children(this.state.strength) : null
    }
}

export default PasswordStrength
