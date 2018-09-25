// @flow

import React, { Component } from 'react'
import cx from 'classnames'
import uniqueId from 'lodash/uniqueId'

import styles from './textInput.pcss'

type Props = {
    className?: string,
    onChange?: (value: string) => void,
    label?: string,
    text?: string,
    loading?: boolean,
}

type State = {
    id: string,
    text: string,
}

class TextInput extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            text: props.text || '',
            id: '',
        }
    }

    componentWillMount() {
        const id = uniqueId('textinput-')
        this.setState({
            id,
        })
    }

    onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const text = e.target.value

        this.setState({
            text,
        })

        if (this.props.onChange) {
            this.props.onChange(text)
        }
    }

    render() {
        const { className, label, loading } = this.props
        const { id, text } = this.state

        return (
            <div>
                <label htmlFor={id} className={cx(styles.input, className)}>
                    <input
                        id={id}
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
