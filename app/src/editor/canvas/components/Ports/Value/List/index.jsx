// @flow

import isEqual from 'lodash/isEqual'
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { type CommonProps } from '..'
import ListEntry from './ListEntry'
import styles from './list.pcss'

type Props = CommonProps & {
    port: any,
}

const EMPTY = []

const List = ({ disabled, onChange, value: valuesProp }: Props) => {
    valuesProp = valuesProp || EMPTY
    const valuesPropRef = useRef()
    valuesPropRef.current = valuesProp
    const [values, setValues] = useState(valuesProp)

    const commit = useCallback((values) => {
        onChange(values.filter((v) => v != null).map((v) => v.trim()))
    }, [onChange])

    const onRemoveClick = useCallback((index: number) => {
        const newValues = values.slice()
        newValues.splice(index, 1)
        setValues(newValues)
    }, [values])

    const onEntryChange = useCallback((index: number, entryValue: string) => {
        const newValues = values.slice()
        entryValue = entryValue.trim()
        newValues[index] = entryValue
        setValues(newValues)
    }, [values])

    const finalValues = useMemo(() => [
        ...values,
        // Append an extra entry at the end…
        null,
    ], [values])

    useEffect(() => {
        setValues((values) => {
            if (isEqual(valuesProp, values)) { return values }
            return valuesProp
        })
    }, [valuesProp])

    useEffect(() => {
        if (isEqual(valuesPropRef.current, values)) { return }
        commit(values)
    }, [values, commit])

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
                        value={v}
                    />
                )
            })}
        </div>
    )
}

export default List
