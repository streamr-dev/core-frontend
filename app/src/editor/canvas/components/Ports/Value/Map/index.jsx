// @flow

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { type CommonProps } from '..'
import MapEntry, { type Sender } from './MapEntry'
import styles from './map.pcss'

type Props = CommonProps & {
    port: any,
}

const EMPTY = {}

const Map = ({ disabled, onChange, value: valueProp }: Props) => {
    valueProp = valueProp || EMPTY
    const [value, setValue] = useState(valueProp)

    const [keys, setKeys] = useState(Object.keys(valueProp))

    const commit = useCallback((keys, values) => {
        const trimmedKeys = keys.map((k) => k.trim()).filter(Boolean)

        // Throw away unused keys…
        const value = Object.keys(values).reduce((memo, k) => {
            if (trimmedKeys.includes(k)) {
                return {
                    ...memo,
                    [k]: values[k].trim(),
                }
            }
            return memo
        }, {})

        onChange(value)
    }, [onChange])

    const onRemoveClick = useCallback((index: number) => {
        const newKeys = [...keys]
        newKeys.splice(index, 1)
        setKeys(newKeys)

        commit(newKeys, value)
    }, [keys, commit, value])

    const onEntryChange = useCallback((index: number, entryKey: string, entryValue: string, sender: Sender) => {
        const newKeys = [...keys]
        newKeys[index] = entryKey
        setKeys(newKeys)

        const key = entryKey.trim()
        const newValue = {
            ...value,
            [key]: (
                entryValue || sender === 'value' ? entryValue : (value[key] || '')
            ),
        }
        setValue(newValue)

        commit(newKeys, newValue)
    }, [value, keys, commit])

    const finalEntries = useMemo(() => [
        ...keys.map((k) => [k, value[k.trim()]]),
        // Append an extra entry at the end…
        ['', ''],
    ], [value, keys])

    useEffect(() => {
        setValue(valueProp)

        setKeys((keys) => {
            const trimmedKeys = keys.map((k) => k.trim()).filter(Boolean)
            const incomingKeys = Object.keys(valueProp)

            return [
                // Keep the ones that still exist in valueProp.
                ...trimmedKeys.filter((k) => incomingKeys.includes(k)),
                // Append the ones that are new.
                ...incomingKeys.filter((k) => !trimmedKeys.includes(k)),
            ]
        })
    }, [valueProp])

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
