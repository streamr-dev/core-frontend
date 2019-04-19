// @flow

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { type CommonProps } from '..'
import MapEntry from './MapEntry'
import styles from './map.pcss'

type Props = CommonProps & {
    port: any,
}

const Map = ({ disabled, onChange, value }: Props) => {
    const [entries, setEntries] = useState(Object.entries(value))

    const commit = useCallback((newEntries) => {
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
    }, [onChange])

    const onRemoveClick = useCallback((index: number) => {
        const newEntries = [...entries]
        newEntries.splice(index, 1)
        setEntries(newEntries)
        commit(newEntries)
    }, [entries, commit])

    const onEntryChange = useCallback((index: number, name: string, value: string) => {
        const newEntries = [...entries]
        newEntries.splice(index, 1, [name, value])
        setEntries(newEntries)
        commit(newEntries)
    }, [entries, commit])

    const finalEntries = useMemo(() => [...entries, ['', '']], [entries])

    useEffect(() => {
        setEntries(Object.entries(value))
    }, [value])

    return (
        <div className={styles.root}>
            {finalEntries.map(([name, val], index) => {
                const v: any = val

                return (
                    <MapEntry
                        disabled={disabled}
                        index={index}
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        name={name}
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
