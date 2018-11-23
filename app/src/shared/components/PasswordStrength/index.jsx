// @flow

import { PureComponent, type Node } from 'react'
import zxcvbn from '$utils/zxcvbn'

type Props = {
    children: (number) => Node,
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

    async getScore() {
        const { enabled, value } = this.props

        if (!enabled || !value) {
            return -1
        }

        return (await zxcvbn())(value || '').score
    }

    measure() {
        this.getScore().then((strength) => {
            this.setState({
                strength,
            })
        })
    }

    render() {
        return this.props.children(this.state.strength)
    }
}

export default PasswordStrength
