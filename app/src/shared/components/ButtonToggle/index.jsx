// @flow

import React, { useState, useCallback } from 'react'
import cx from 'classnames'

import styles from './buttonToggle.pcss'

type Props = {
    options: Array<string>,
    defaultSelectedOption?: string,
    className?: string,
    onChange?: (string) => void,
}

const ButtonToggle = ({ options, defaultSelectedOption, className, onChange }: Props) => {
    const [selection, setSelection] = useState(defaultSelectedOption)

    const onClick = useCallback((option: string) => {
        if (selection === option) {
            return
        }

        setSelection(option)

        if (onChange) {
            onChange(option)
        }
    }, [selection, onChange])

    return (
        <div className={cx(styles.root, className)}>
            {options.map((option) => (
                /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
                <div
                    role="button"
                    tabIndex="0"
                    onClick={() => onClick(option)}
                    className={cx(styles.option, {
                        [styles.selected]: option === selection,
                    })}
                >
                    {option}
                </div>
            ))}
        </div>
    )
}

export default ButtonToggle
