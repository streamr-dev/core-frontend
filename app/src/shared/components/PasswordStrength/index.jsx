// @flow

import { PureComponent, type Node } from 'react'
import zxcvbn from '$utils/zxcvbn'

type Props = {
    children?: (number) => Node,
    enabled?: boolean,
    fakeStrength?: number,
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

    async getStrength() {
        const { enabled, fakeStrength, value } = this.props

        if (!enabled || !value) {
            return -1
        }

        if (fakeStrength != null) {
            return fakeStrength
        }

        return [0, 1, 1, 2, 2][(await zxcvbn())(value || '').score]
    }

    measure() {
        this.getStrength().then((strength) => {
            this.setState({
                strength,
            })
        })
    }

    render() {
        const { children } = this.props
        return children ? children(this.state.strength) : null
    }
}

export default PasswordStrength
