// @flow

import { PureComponent, type Node } from 'react'

import CancelledPromiseError from '$shared/errors/CancelledPromiseError'
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
        this.loadMeasurer()
    }

    componentDidUpdate() {
        this.loadMeasurer()
        this.measure()
    }

    componentWillUnmount() {
        const { getZxcvbn } = this
        if (getZxcvbn) {
            getZxcvbn.cancel()
        }
    }

    getZxcvbn: ?Cancelable = null

    loadMeasurer() {
        const { enabled, value } = this.props

        if (!this.getZxcvbn && enabled && value) {
            this.getZxcvbn = makeCancelable(zxcvbn())
            this.getZxcvbn.promise.then((measurer) => {
                this.setState({
                    measurer,
                }, this.measure)
            }, (error) => {
                if (!(error instanceof CancelledPromiseError)) {
                    throw error
                }
            })
        }
    }

    strength(): number {
        const { value } = this.props
        const { measurer } = this.state

        if (!measurer) {
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
