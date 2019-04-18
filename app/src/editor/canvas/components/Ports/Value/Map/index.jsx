// @flow

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { type Ref } from '$shared/flowtype/common-types'
import { type CommonProps } from '..'
import MapEntry from './MapEntry'
import styles from './map.pcss'

type Props = CommonProps & {
    port: any,
}

const Map = ({ disabled, onChange, value }: Props) => {
    const focusIndex: Ref<number> = useRef(-1)

    const [entries, setEntries] = useState(Object.entries(value))

    const onAddClick = useCallback((index: number) => {
        const newEntries = [...entries]
        focusIndex.current = index + 1
        newEntries.splice(focusIndex.current, 0, ['', ''])
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

    useEffect(() => {
        setEntries(Object.entries(value))
    }, [value])

    return (
        <div className={styles.root}>
            {finalEntries.map(([name, val], index) => {
                const v: any = val

                return (
                    <MapEntry
                        autoFocusName={focusIndex.current === index}
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
