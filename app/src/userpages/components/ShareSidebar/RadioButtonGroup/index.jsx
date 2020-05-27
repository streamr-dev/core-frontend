// @flow

import React, { useState, useCallback, useEffect } from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import styles from './RadioButtonGroup.pcss'

type Props = {
    name: string,
    options: Array<string>,
    selectedOption?: string,
    className?: string,
    onChange?: (string, SyntheticEvent<>) => void,
    disabled?: boolean,
    isCustom?: boolean,
}

const RadioButtonGroup = ({
    name,
    options,
    selectedOption,
    className,
    onChange,
    disabled = false,
    isCustom,
}: Props) => {
    const [selection, setSelection] = useState(selectedOption)

    // Reflect outside changes of 'selectedOption' into the state
    useEffect(() => {
        setSelection(selectedOption)
    }, [selectedOption, setSelection])

    const onCheck = useCallback((option: string, event) => {
        if (disabled) {
            return
        }
        setSelection(option)

        if (onChange) {
            onChange(option, event)
        }
    }, [disabled, onChange])

    return (
        <div className={cx(styles.root, className)}>
            <div className={styles.inner}>
                <div className={styles.buttonGrid}>
                    {options.map((option, index) => (
                        <div
                            key={option}
                            className={cx(styles.option, {
                                [styles.selected]: selection === option,
                                [styles.isCustom]: selection === option && isCustom,
                            })}
                        >
                            <input
                                id={`${name}-${index}`}
                                type="radio"
                                name={name}
                                value={option}
                                className={styles.radio}
                                onChange={() => {
                                    /* noop, use mousedown so can reset custom when click existing selection */
                                    /* have to supply onChange otherwise React makes input readOnly, thus mouse handlers don't work */
                                }}
                                onClick={(event) => {
                                    onCheck(option, event)
                                }}
                                checked={selection === option}
                                disabled={disabled}
                            />
                            <label
                                htmlFor={`${name}-${index}`}
                                className={styles.label}
                            >
                                {startCase(option)}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RadioButtonGroup
