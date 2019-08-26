// @flow

import React from 'react'
import cx from 'classnames'
import * as State from '../../../state'
import Color from './Color'
import Map from './Map'
import Select from './Select'
import Stream from './Stream'
import Text from './Text'
import styles from './value.pcss'

type Props = {
    disabled: boolean,
    canvas: any,
    port: any,
    onChange: (any) => void,
}

type PortType = 'map' | 'color' | 'select' | 'text' | 'stream' | 'defactoBoolean'

const getPortValueType = (canvas: any, port: any): PortType => {
    const { type } = port
    const portTypes = new Set(type.split(' '))
    switch (true) {
        case !!port.possibleValues:
            return 'select'
        case (typeof port.initialValue === 'boolean'):
            // Many boolean ports are of type Object
            // so assume boolean type from type of initialValue
            return 'defactoBoolean'
        case portTypes.has('Map'):
            return 'map'
        case portTypes.has('Color'):
            return 'color'
        case portTypes.has('Stream'):
            return 'stream'
        default:
    }
    return 'text'
}

export type CommonProps = {
    disabled: boolean,
    onChange: (any) => void,
    value: any,
    placeholder: any,
    title?: string,
    id?: string,
    className?: string,
}
const BooleanPossibleValues = [{
    name: 'false',
    value: 'false',
}, {
    name: 'true',
    value: 'true',
}]

const Value = ({ canvas, disabled, port, onChange }: Props) => {
    // Enable non-running input whether connected or not if port.canHaveInitialValue
    const portValueEditDisabled = State.isPortValueEditDisabled(canvas, port.id)
    const editDisabled = disabled || portValueEditDisabled
    const valueType = getPortValueType(canvas, port)
    const placeholder = State.getPortPlaceholder(canvas, port.id)
    const value = State.getPortValue(canvas, port.id)

    const commonProps: CommonProps = {
        disabled: editDisabled,
        onChange,
        value,
        placeholder,
    }

    return (
        <div
            className={cx(styles.root, {
                [styles.disabled]: disabled,
            })}
        >
            {valueType === 'map' && (
                <Map
                    {...commonProps}
                    port={port}
                />
            )}
            {valueType === 'color' && (
                <Color
                    {...commonProps}
                />
            )}
            {(valueType === 'select' || valueType === 'defactoBoolean') && (
                (!portValueEditDisabled ? (
                    <Select
                        {...commonProps}
                        value={value == null ? '' : String(value) /* coerce option value to string */}
                        options={valueType === 'defactoBoolean' ? BooleanPossibleValues : port.possibleValues}
                    />
                ) : (
                    <Text
                        value={value == null ? '' : String(value) /* coerce option value to string */}
                        {...commonProps}
                        disabled
                    />
                ))
            )}
            {valueType === 'text' && (
                <Text
                    {...commonProps}
                />
            )}
            {valueType === 'stream' && (
                <Stream
                    {...commonProps}
                />
            )}
        </div>
    )
}

export default Value
