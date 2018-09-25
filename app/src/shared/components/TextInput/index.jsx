// @flow

import React, { Component } from 'react'
import cx from 'classnames'

import styles from './textInput.pcss'

type Props = {
    className?: string,
    onChange?: (value: string) => void,
    label?: string,
    text?: string,
    loading?: boolean,
}

type State = {
    text: string,
}

class TextInput extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            text: props.text || '',
        }
    }

    onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const text = e.target.value
        const { onChange } = this.props

        this.setState({
            text,
        })

        if (onChange) {
            onChange(text)
        }
    }

    render() {
        const { className, label, loading } = this.props
        const { text } = this.state

        return (
            <div>
                <label className={cx(styles.input, className)}>
                    <input
                        type="text"
                        onChange={this.onChange}
                        value={text}
                        placeholder="&nbsp;"
                        className={cx(loading && styles.loading)}
                    />
                    <span className={styles.label}>{label}</span>
                    <span className={cx(styles.border, loading && styles.loading)} />
                </label>
            </div>
        )
    }
}

export default TextInput
