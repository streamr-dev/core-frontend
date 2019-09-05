// @flow

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { type CommonProps } from '..'
import ListEntry from './ListEntry'
import styles from './list.pcss'

type Props = CommonProps & {
    port: any,
}

const EMPTY = []

const List = ({ disabled, onChange, value: valuesProp }: Props) => {
    valuesProp = valuesProp || EMPTY
    const [values, setValues] = useState(valuesProp)

    const commit = useCallback((values) => {
        onChange(values.map((v) => v.trim()).filter((v) => v != null))
    }, [onChange])

    const onRemoveClick = useCallback((index: number) => {
        const newValues = [...values]
        newValues.splice(index, 1)
        setValues(newValues)

        commit(newValues)
    }, [commit, values])

    const onEntryChange = useCallback((index: number, entryValue: string) => {
        const newValues = [...values]
        entryValue = entryValue.trim()
        newValues[index] = entryValue
        setValues(newValues)
        commit(newValues)
    }, [values, commit])

    const finalValues = useMemo(() => [
        ...values,
        // Append an extra entry at the end…
        undefined,
    ], [values])

    useEffect(() => {
        setValues(valuesProp.map((v) => v.trim()).filter((v) => v != null))
    }, [valuesProp])

    return (
        <div className={styles.root}>
            {finalValues.map((val, index) => {
                const v: any = val

                return (
                    <ListEntry
                        disabled={disabled}
                        index={index}
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        onChange={onEntryChange}
                        onRemoveClick={onRemoveClick}
                        removable={index !== finalValues.length - 1}
                        addable={index === finalValues.length - 1 && finalValues[index] == null}
                        value={v}
                    />
                )
            })}
        </div>
    )
}

export default List
