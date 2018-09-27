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
        const { onChange } = this.props

        this.setState({
            value,
        })

        if (onChange) {
            onChange(value)
        }
    }

    render() {
        const { className } = this.props
        const { value } = this.state
        return (
            <div className={cx(className)}>
                <label className={cx(styles.switch, styles.label)}> {/* eslint-disable-line jsx-a11y/label-has-for */}
                    <input type="checkbox" onChange={this.onChange} checked={value} />
                    <span className={cx(styles.slider)} />
                </label>
            </div>
        )
    }
}

export default Toggle
