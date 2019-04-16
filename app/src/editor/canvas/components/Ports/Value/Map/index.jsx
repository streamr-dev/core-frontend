// @flow

import React, { useState, useCallback, useMemo } from 'react'
import { type CommonProps } from '..'
import MapEntry from './MapEntry'
import styles from './map.pcss'

type Props = CommonProps & {
    port: any,
}

const Map = ({ disabled, onChange, value }: Props) => {
    const [entries, setEntries] = useState(Object.entries(value))

    const onAddClick = useCallback((index: number) => {
        const newPairs = [...entries]
        newPairs.splice(index + 1, 0, ['', ''])
        setEntries(newPairs)
    }, [entries])

    const onRemoveClick = useCallback((index: number) => {
        const newPairs = [...entries]
        newPairs.splice(index, 1)
        setEntries(newPairs)
    }, [entries])

    const onEntryChange = useCallback((index: number, name: string, value: mixed) => {
        const newPairs = [...entries]
        newPairs.splice(index, 1, [name, value])
        setEntries(newPairs)
        onChange(newPairs)
    }, [entries, onChange])

    const finalEntries = useMemo(() => (
        entries.length ? entries : [['', '']]
    ), [entries])

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
