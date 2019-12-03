// @flow

import React, { useCallback, useState } from 'react'
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
}

const NumberField = ({
    className,
    value,
    type,
    min,
    max,
    step,
    hideButtons,
    ...props
}: Props) => {
    const [internalValue, setInternalValue] = useState(value)

    const onChange = useCallback((event: SyntheticInputEvent<EventTarget>) => {
        setInternalValue(event.target.value)
    }, [])

    const addValue = useCallback((val) => {
        let parsedValue = Number.parseFloat(internalValue)
        let parsedStep = Number.parseFloat(val)

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

        setInternalValue(newValue)
    }, [min, max, internalValue])

    const onIncrease = useCallback(() => {
        addValue(step != null ? step : 1)
    }, [addValue, step])

    const onDecrease = useCallback(() => {
        addValue(-(step != null ? step : 1))
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
