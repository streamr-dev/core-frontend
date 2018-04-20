// @flow

import React from 'react'
import classNames from 'classnames'

import styles from './ethAddressField.pcss'

type Props = {
    id: string,
    label: string,
    value: string,
    onChange?: (string) => void,
}

class EthAddressField extends React.Component<Props> {
    onChange = (e: SyntheticInputEvent<EventTarget>) => {
        const { onChange } = this.props

        if (onChange) {
            onChange(e.target.value)
        }
    }

    readOnly = () => !this.props.onChange

    render() {
        const { id, label, value } = this.props
        const readOnly = this.readOnly()

        return (
            <div className={classNames(styles.field, readOnly && styles.readOnly)}>
                <label htmlFor={id}>
                    <div>* {label}</div>
                    <input id={id} type="text" value={value} onChange={this.onChange} readOnly={readOnly} />
                </label>
            </div>
        )
    }
}

export default EthAddressField
