// @flow

import React from 'react'
import { RunStates } from '../../../state'
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
}

const Value = ({ canvas, port, onChange }: Props) => {
    const isRunning = canvas.state === RunStates.Running
    // Enable non-running input whether connected or not if port.canHaveInitialValue
    const disabled = isRunning || (!port.canHaveInitialValue && port.connected)
    const type = getPortType(port)
    const isParam = 'defaultValue' in port

    // TODO: Ignore when editing.
    const value = (isParam ? (port.value || port.defaultValue) : port.initialValue) || ''
    const commonProps: CommonProps = {
        disabled,
        onChange,
        value,
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
                    placeholder={port.displayName || port.name}
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
