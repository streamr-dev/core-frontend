// @flow

import React, { useCallback, Fragment } from 'react'
import Text from '../../Text'
import styles from './mapEntry.pcss'

type Index = number

type Name = string

type Value = string

export type Sender = 'name' | 'value'

type Props = {
    disabled?: boolean,
    index: Index,
    name: Name,
    onAddClick?: ?(Index) => void,
    onChange: (Index, Name, Value, Sender) => void,
    onRemoveClick?: ?(Index) => void,
    removable?: boolean,
    value: Value,
}

const MapEntry = ({
    disabled,
    index,
    name,
    onChange: onChangeProp,
    onRemoveClick: onRemoveClickProp,
    removable,
    value,
}: Props) => {
    const onNameChange = useCallback((newName) => {
        onChangeProp(index, newName, value, 'name')
    }, [index, value, onChangeProp])

    const onValueChange = useCallback((newValue) => {
        onChangeProp(index, name, newValue, 'value')
    }, [index, name, onChangeProp])

    const onRemoveClick = useCallback(() => {
        if (onRemoveClickProp) {
            onRemoveClickProp(index)
        }
    }, [index, onRemoveClickProp])

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
                {!!removable && (
                    <button
                        className={styles.button}
                        type="button"
                        onClick={onRemoveClick}
                    >
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.2 8H4.8" stroke="#323232" fill="none" strokeLinecap="round" />
                        </svg>
                    </button>
                )}
            </div>
        </Fragment>
    )
}

export default MapEntry
