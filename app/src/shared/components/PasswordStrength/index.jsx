// @flow

import { PureComponent, type Node } from 'react'

import zxcvbn from '$utils/zxcvbn'

type Props = {
    children?: (number) => Node,
    enabled?: boolean,
    value?: string,
    passwordStrengthUpdate?: (number) => void,
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

    componentDidUpdate(prevProps: Props, prevState: State) {
        this.measure()
        if (prevState.strength !== this.state.strength) {
            if (this.props.passwordStrengthUpdate) {
                this.props.passwordStrengthUpdate(this.state.strength)
            }
        }
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
