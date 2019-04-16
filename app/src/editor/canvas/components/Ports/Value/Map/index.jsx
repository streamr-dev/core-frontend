// @flow

import React, { useState, useCallback, useMemo } from 'react'
import { type CommonProps } from '..'
import MapEntry from './MapEntry'

type Props = CommonProps & {
    port: any,
}

const Map = ({ disabled, onChange, value }: Props) => {
    const [entries, setEntries] = useState(Object.entries(value))

    const onAddClick = useCallback((index: number) => {
        const newEntries = [...entries]
        newEntries.splice(index + 1, 0, ['', ''])
        setEntries(newEntries)
    }, [entries])

    const onRemoveClick = useCallback((index: number) => {
        const newEntries = [...entries]
        newEntries.splice(index, 1)
        setEntries(newEntries)
    }, [entries])

    const onEntryChange = useCallback((index: number, name: string, value: string) => {
        const newEntries = [...entries]
        newEntries.splice(index, 1, [name, value])
        setEntries(newEntries)

        const newValue = newEntries
            // Filter out entries with empty `name`.
            .filter(([key = '']) => key.trim())
            // Turn it into an Object.
            .reduce((memo, [key, val = '']) => {
                const v: any = val

                return {
                    ...memo,
                    [key.trim()]: v.trim(),
                }
            }, {})

        onChange(newValue)
    }, [entries, onChange])

    const finalEntries = useMemo(() => (
        entries.length ? entries : [['', '']]
    ), [entries])

    return (
        <div>
            {finalEntries.map(([name, val], index) => {
                const v: any = val

                return (
                    <MapEntry
                        disabled={disabled}
                        index={index}
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        name={name}
                        onAddClick={onAddClick}
                        onChange={onEntryChange}
                        onRemoveClick={onRemoveClick}
                        removable={index !== finalEntries.length - 1}
                        value={v}
                    />
                )
            })}
        </div>
    )
}

export default Map
