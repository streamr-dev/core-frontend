// @flow

import { PureComponent, type Node } from 'react'

import makeCancelable, { type Cancelable } from '$utils/makeCancelable'
import zxcvbn from '$utils/zxcvbn'

type Props = {
    children?: (number) => Node,
    enabled?: boolean,
    value?: string,
}

type State = {
    measurer: ?(string) => {
        score: number,
    },
    strength: number,
}

class PasswordStrength extends PureComponent<Props, State> {
    state = {
        measurer: null,
        strength: -1,
    }

    componentDidMount() {
        this.getZxcvbn = makeCancelable(zxcvbn().then((measurer) => {
            this.setState({
                measurer,
            }, this.measure)
        }))
    }

    componentDidUpdate() {
        this.measure()
    }

    componentWillUnmount() {
        const { getZxcvbn } = this
        if (getZxcvbn) {
            getZxcvbn.cancel()
        }
    }

    getZxcvbn: ?Cancelable = null

    strength(): number {
        const { enabled, value } = this.props
        const { measurer } = this.state

        if (!measurer || !enabled || !value) {
            return -1
        }

        return [0, 1, 1, 2, 2][measurer(value || '').score]
    }

    measure() {
        this.setState({
            strength: this.strength(),
        })
    }

    render() {
        const { children } = this.props
        return children ? children(this.state.strength) : null
    }
}

export default PasswordStrength
