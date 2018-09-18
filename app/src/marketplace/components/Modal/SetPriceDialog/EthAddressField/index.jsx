// @flow

import React from 'react'
import classNames from 'classnames'

import styles from './ethAddressField.pcss'

type Props = {
    id: string,
    label: string,
    value: string,
    hasError: boolean,
    onChange?: (string) => void,
}

class EthAddressField extends React.Component<Props> {
    static defaultProps = {
        hasError: false,
    }

    onChange = (e: SyntheticInputEvent<EventTarget>) => {
        const { onChange } = this.props

        if (onChange) {
            onChange(e.target.value)
        }
    }

    readOnly = () => !this.props.onChange

    render() {
        const { id, label, value, hasError } = this.props
        const readOnly = this.readOnly()

        return (
            <div className={classNames(styles.field, readOnly && styles.readOnly, hasError && styles.error)}>
                <label htmlFor={id}>
                    <div>* {label}</div>
                    <input id={id} type="text" value={value} onChange={this.onChange} readOnly={readOnly} />
                </label>
            </div>
        )
    }
}

export default EthAddressField
