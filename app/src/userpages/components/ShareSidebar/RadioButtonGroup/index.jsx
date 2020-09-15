// @flow

import React, { useState, useCallback, useEffect } from 'react'
import cx from 'classnames'
import styled from 'styled-components'
import startCase from 'lodash/startCase'
import { SANS } from '$shared/utils/styled'

import styles from './RadioButtonGroup.pcss'

type Props = {
    name: string,
    options: Array<string>,
    selectedOption?: string,
    className?: string,
    onChange?: (string, SyntheticEvent<>) => void,
    disabled?: boolean,
    isCustom?: boolean,
    selected?: boolean,
}

const UnstyledRadioButtonGroup = ({
    name,
    options,
    selectedOption,
    onChange,
    disabled = false,
    isCustom,
    selected,
    ...props
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
        <div {...props}>
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

const RadioButtonGroup = styled(UnstyledRadioButtonGroup)`
    font-family: ${SANS};
    font-size: 14px;
    line-height: normal;
    text-align: center;
    width: 100%;
`

export default RadioButtonGroup
