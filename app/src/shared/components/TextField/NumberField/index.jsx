// @flow

import React, { useCallback, useState, useRef } from 'react'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'

import styles from '../textField.pcss'

type Props = {
    className?: string,
    value?: string,
    type?: string,
    min?: number,
    max?: number,
    step?: number,
    hideButtons?: boolean,
    onChange?: (SyntheticInputEvent<EventTarget>) => void,
}

const NumberField = ({
    className,
    value,
    type,
    min,
    max,
    step,
    hideButtons,
    onChange: onChangeProp,
    ...props
}: Props) => {
    const [internalValue, setInternalValue] = useState(value)
    const inputRef = useRef()

    const onChange = useCallback((event: SyntheticInputEvent<EventTarget>) => {
        setInternalValue(event.target.value)

        if (onChangeProp) {
            onChangeProp(event)
        }
    }, [onChangeProp])

    const addValue = useCallback((event: SyntheticInputEvent<EventTarget>, val) => {
        let parsedValue = Number.parseFloat(internalValue != null ? internalValue : '')
        let parsedStep = Number.parseFloat(val.toString())

        if (Number.isNaN(parsedValue)) {
            parsedValue = 0
        }
        if (Number.isNaN(parsedStep)) {
            parsedStep = 1
        }

        let newValue = parsedValue + parsedStep

        if (min != null && newValue < min) {
            newValue = min
        }
        if (max != null && newValue > max) {
            newValue = max
        }

        if (inputRef.current) {
            inputRef.current.focus()
        }

        // eslint-disable-next-line no-param-reassign
        event.target.value = newValue.toString()

        onChange(event)
    }, [min, max, internalValue, onChange])

    const onIncrease = useCallback((event: SyntheticInputEvent<EventTarget>) => {
        event.preventDefault()
        addValue(event, step != null ? step : 1)
    }, [addValue, step])

    const onDecrease = useCallback((event: SyntheticInputEvent<EventTarget>) => {
        event.preventDefault()
        addValue(event, -(step != null ? step : 1))
    }, [addValue, step])

    return (
        <React.Fragment>
            <input
                {...props}
                type={type}
                min={min}
                max={max}
                step={step}
                value={internalValue != null ? internalValue : ''}
                onChange={onChange}
                className={cx(className, styles.root)}
                ref={inputRef}
            />
            {!hideButtons && type === 'number' && (
                <div className={styles.buttonContainer}>
                    <button type="button" className={styles.numberButton} onClick={onIncrease}>
                        <SvgIcon name="caretUp" />
                    </button>
                    <button type="button" className={styles.numberButton} onClick={onDecrease}>
                        <SvgIcon name="caretDown" />
                    </button>
                </div>
            )}
        </React.Fragment>
    )
}

NumberField.defaultProps = {
    hideButtons: false,
}

export default NumberField
