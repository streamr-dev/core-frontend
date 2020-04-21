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
}

const RadioButtonGroup = ({
    name,
    options,
    selectedOption,
    className,
    onChange,
    disabled = false,
}: Props) => {
    const [selection, setSelection] = useState(selectedOption)

    // Reflect outside changes of 'selectedOption' into the state
    useEffect(() => {
        setSelection(selectedOption)
    }, [selectedOption, setSelection])

    const onCheck = useCallback((option: string, event) => {
        if (disabled || selection === option) {
            return
        }
        setSelection(option)

        if (onChange) {
            onChange(option, event)
        }
    }, [disabled, selection, onChange])

    return (
        <div className={cx(styles.root, className)}>
            <div className={styles.inner}>
                <div className={styles.buttonGrid}>
                    {options.map((option, index) => (
                        <div key={option} data-selected={selection === option}>
                            <input
                                id={`${name}-${index}`}
                                type="radio"
                                name={name}
                                value={option}
                                className={styles.radio}
                                onChange={(event) => onCheck(option, event)}
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
