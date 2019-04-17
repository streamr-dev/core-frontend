// @flow

import React, { useCallback, useMemo, Fragment } from 'react'
import Text from '../../Text'
import styles from './mapEntry.pcss'

type Index = number

type Name = string

type Value = string

type Props = {
    disabled?: boolean,
    index: Index,
    name: Name,
    onAddClick?: ?(Index) => void,
    onChange: (Index, Name, Value) => void,
    onRemoveClick?: ?(Index) => void,
    removable?: boolean,
    value: Value,
}

const MapEntry = ({
    disabled,
    index,
    name,
    onAddClick: onAddClickProp,
    onChange: onChangeProp,
    onRemoveClick: onRemoveClickProp,
    removable,
    value,
}: Props) => {
    const onNameChange = useCallback((newName) => {
        onChangeProp(index, newName, value)
    }, [index, value, onChangeProp])

    const onValueChange = useCallback((newValue) => {
        onChangeProp(index, name, newValue)
    }, [index, name, onChangeProp])

    const onRemoveClick = useCallback(() => {
        if (onRemoveClickProp) {
            onRemoveClickProp(index)
        }
    }, [index, onRemoveClickProp])

    const onAddClick = useCallback(() => {
        if (onAddClickProp) {
            onAddClickProp(index)
        }
    }, [index, onAddClickProp])

    const canAdd = useMemo(() => (
        !!(name.trim() || value.trim())
    ), [name, value])

    return (
        <Fragment>
            <Text
                disabled={!!disabled}
                onChange={onNameChange}
                placeholder="Key"
                value={name}
            />
            <Text
                disabled={!!disabled}
                onChange={onValueChange}
                placeholder="Value"
                value={value}
            />
            {/* Unnamed possibly empty div. It's the 3rd column in Map's 3-column grid. Keep it. */}
            <div>
                {removable ? (
                    <button
                        className={styles.button}
                        type="button"
                        onClick={onRemoveClick}
                    >
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.2 8H4.8" stroke="#323232" fill="none" strokeLinecap="round" />
                        </svg>
                    </button>
                ) : (canAdd && (
                    <button
                        className={styles.button}
                        type="button"
                        onClick={onAddClick}
                    >
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 4.8v6.4M11.2 8H4.8" fill="none" strokeLinecap="round" stroke="#323232" />
                        </svg>
                    </button>
                ))}
            </div>
        </Fragment>
    )
}

export default MapEntry
