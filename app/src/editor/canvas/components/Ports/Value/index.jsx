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

type PortType = 'map' | 'color' | 'select' | 'text' | 'stream'

const getPortValueType = (canvas: any, port: any): PortType => {
    const { type } = port
    const portTypes = new Set(type.split(' '))
    switch (true) {
        // anything with possible values should render as a select
        case !!port.possibleValues:
            return 'select'

        // Many boolean ports are of type Object
        // so assume boolean type from type of initialValue
        case (State.isPortBoolean(canvas, port.id)):
            return 'select'

        // straight type mapping
        case portTypes.has('Map'):
            return 'map'
        case portTypes.has('Color'):
            return 'color'
        case portTypes.has('Stream'):
            return 'stream'
        default:
            // anything else is text
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

/**
 * Generated options structure for a true/false dropdown.
 */

const BooleanPossibleValues = [{
    name: 'false',
    value: 'false',
}, {
    name: 'true',
    value: 'true',
}]

/**
 * 'Smarter' Select component for ports.
 * Handles rendering true/false dropdown for inferred 'boolean' ports
 * Shows small label in dropdown when the select is for setting an initial value
 * Ensures value passed to select is always a string.
 */

function PortSelect({ canvas, port, value, ...props }) {
    const portValueEditDisabled = State.isPortValueEditDisabled(canvas, port.id)
    value = value == null ? undefined : String(value) /* coerce option value to string or undefined */
    if (portValueEditDisabled) {
        // always render as disabled text box if value editing is disabled
        return (
            <Text
                value={value}
                {...props}
                disabled
            />
        )
    }

    let { possibleValues: options } = port
    if (!options) {
        // inject boolean dropdown if no options and type appears to be boolean
        options = State.isPortBoolean(canvas, port.id) ? BooleanPossibleValues : []
    }

    // show initial value label for initial values
    const description = port.canHaveInitialValue ? 'Initial Value' : undefined

    return (
        <Select
            {...props}
            value={value}
            options={options}
            description={description}
        />
    )
}

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
            {valueType === 'text' && (
                <Text {...commonProps} />
            )}
            {valueType === 'color' && (
                <Color {...commonProps} />
            )}
            {valueType === 'stream' && (
                <Stream {...commonProps} />
            )}
            {valueType === 'map' && (
                <Map
                    {...commonProps}
                    port={port}
                />
            )}
            {(valueType === 'select') && (
                <PortSelect
                    {...commonProps}
                    canvas={canvas}
                    port={port}
                />
            )}
        </div>
    )
}

export default Value
