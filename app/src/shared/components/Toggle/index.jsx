// @flow

import React, { Component } from 'react'
import cx from 'classnames'

import styles from './toggle.pcss'

type Props = {
    className?: string,
    disabled?: boolean,
    onChange?: (checked: boolean) => void,
    value?: boolean,
}

type State = {}

class ControlledToggle extends Component<Props, State> {
    onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const value = e.target.checked
        const { onChange } = this.props

        if (typeof onChange === 'function') {
            onChange(value)
        }
    }

    render() {
        const {
            className,
            disabled,
            value,
            onChange,
            ...rest
        } = this.props
        return (
            <div className={cx(className)}>
                <label
                    className={cx(styles.switch, styles.label, {
                        [styles.disabled]: disabled,
                    })}
                >
                    <input
                        type="checkbox"
                        onChange={this.onChange}
                        checked={value}
                        disabled={disabled}
                        {...rest}
                    />
                    <span className={cx(styles.slider)} />
                </label>
            </div>
        )
    }
}

export default ControlledToggle
