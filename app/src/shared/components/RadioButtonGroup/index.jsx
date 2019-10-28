// @flow

import React, { useState, useCallback, useEffect } from 'react'
import cx from 'classnames'

import styles from './radioButtonGroup.pcss'

type Props = {
    name: string,
    options: Array<string>,
    selectedOption?: string,
    className?: string,
    onChange?: (string) => void,
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

    const onCheck = useCallback((option: string) => {
        if (disabled || selection === option) {
            return
        }

        setSelection(option)

        if (onChange) {
            onChange(option)
        }
    }, [disabled, selection, onChange])

    return (
        <div className={cx(styles.root, className)}>
            {options.map((option, index) => (
                <div key={option}>
                    <input
                        id={`${name}-${index}`}
                        type="radio"
                        name={name}
                        value={option}
                        className={styles.radio}
                        onChange={() => onCheck(option)}
                        checked={selection === option}
                        disabled={disabled}
                    />
                    <label
                        htmlFor={`${name}-${index}`}
                        className={styles.label}
                    >
                        {option}
                    </label>
                </div>
            ))}
        </div>
    )
}

export default RadioButtonGroup
