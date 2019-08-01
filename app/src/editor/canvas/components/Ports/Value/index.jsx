// @flow

import React from 'react'
import * as State from '../../../state'
import Color from './Color'
import Map from './Map'
import Select from './Select'
import Stream from './Stream'
import Text from './Text'
import styles from './value.pcss'

type Props = {
    canvas: any,
    port: any,
    onChange: (any) => void,
}

type PortType = 'map' | 'color' | 'select' | 'text' | 'stream'

const getPortType = (port: any): PortType => {
    switch (true) {
        case port.type === 'Map':
            return 'map'
        case port.type === 'Color':
            return 'color'
        case !!port.possibleValues:
            return 'select'
        case port.type === 'Stream':
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
}

const Value = ({ canvas, port, onChange }: Props) => {
    // Enable non-running input whether connected or not if port.canHaveInitialValue
    const disabled = State.isPortValueEditDisabled(canvas, port.id)
    const type = getPortType(port)
    const value = State.getPortValue(canvas, port.id)
    const placeholder = State.getPortPlaceholder(canvas, port.id)
    const commonProps: CommonProps = {
        disabled,
        onChange,
        value,
        placeholder,
    }

    return (
        <div className={styles.root}>
            {type === 'map' && (
                <Map
                    {...commonProps}
                    port={port}
                />
            )}
            {type === 'color' && (
                <Color
                    {...commonProps}
                />
            )}
            {type === 'select' && (
                <Select
                    {...commonProps}
                    options={port.possibleValues}
                />
            )}
            {type === 'text' && (
                <Text
                    {...commonProps}
                />
            )}
            {type === 'stream' && (
                <Stream
                    {...commonProps}
                />
            )}
        </div>
    )
}

export default Value
