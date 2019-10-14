// @flow

import React, { useCallback, Fragment } from 'react'
import Text from '../../Text'
import mapStyles from '../../Map/MapEntry/mapEntry.pcss'
import styles from './listEntry.pcss'

type Index = number

type Value = string

type Props = {
    disabled?: boolean,
    index: Index,
    onAddClick?: ?(Index) => void,
    onChange: (Index, Value) => void,
    onRemoveClick?: ?(Index) => void,
    isLast?: boolean,
    value: Value,
}

const noop = () => {}

const ListEntry = ({
    disabled,
    index,
    onChange: onChangeProp,
    onRemoveClick: onRemoveClickProp,
    isLast,
    value,
}: Props) => {
    const onValueChange = useCallback((newValue) => {
        onChangeProp(index, newValue)
    }, [index, onChangeProp])

    const onAddClick = useCallback(() => {
        // convert empty to value
        onChangeProp(index, value == null ? '' : value)
    }, [index, value, onChangeProp])

    const onRemoveClick = useCallback(() => {
        if (onRemoveClickProp) {
            onRemoveClickProp(index)
        }
    }, [index, onRemoveClickProp])

    return (
        <Fragment>
            {/* Use empty text input as 'label' */}
            <Text
                className={styles.label}
                disabled
                tabIndex="-1"
                value={`${index}:`}
                onChange={noop}
            />
            <Text
                disabled={!!disabled}
                onChange={onValueChange}
                placeholder={`Item ${index}`}
                value={value}
                autoFocus
            />
            {/* Unnamed possibly empty div. It's the 3rd column in Map's 3-column grid. Keep it. */}
            <div>
                {/*
                    Note: Added keys to these buttons.
                    This prevents a mousedown/blur on the add button triggering the add button to change to a remove button
                    and then following mouseup then being treated as if it was a click on the remove button
                    i.e. prevents it from immediately removing rows after adding them.
                */}
                {isLast ? (
                    <button
                        key="remove"
                        className={mapStyles.button}
                        type="button"
                        onClick={onRemoveClick}
                        disabled={disabled}
                    >
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.2 8H4.8" stroke="#323232" fill="none" strokeLinecap="round" />
                        </svg>
                    </button>
                ) : (
                    <button
                        key="add"
                        className={mapStyles.button}
                        type="button"
                        onClick={onAddClick}
                        disabled={disabled}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <g fill="none" fillRule="evenodd">
                                <g stroke="#323232" strokeLinecap="round">
                                    <path d="M8 4.8v6.4M11.2 8H4.8" />
                                </g>
                            </g>
                        </svg>
                    </button>
                )}
            </div>
        </Fragment>
    )
}

export default ListEntry
