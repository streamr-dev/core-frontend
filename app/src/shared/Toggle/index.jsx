// @flow

import React, { Component } from 'react'
import cx from 'classnames'

import styles from './toggle.pcss'

type Props = {
    className?: string,
    onChange?: (checked: boolean) => void,
    value?: boolean,
}

type State = {
    value: boolean,
}

class Toggle extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            value: !!props.value,
        }
    }

    onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const value = e.target.checked

        this.setState({
            value,
        })

        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }

    render() {
        const { className } = this.props
        const { value } = this.state

        return (
            <div className={cx(styles.switch, className)}>
                <label htmlFor="checkbox" className={cx(styles.switch)}>
                    <input id="checkbox" type="checkbox" onChange={(e) => this.onChange(e)} checked={value} />
                    <span className={cx(styles.slider)} />
                </label>
            </div>
        )
    }
}

export default Toggle
