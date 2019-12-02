// @flow

import React, { useCallback, useState } from 'react'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'

import styles from '../textField.pcss'

type Props = {
    className?: string,
    type?: string,
    min?: number,
    max?: number,
    step?: number,
    hideButtons?: boolean,
}

const NumberField = ({ className, hideButtons, ...props }: Props) => {
    const [value, setValue] = useState(null)

    const addValue = useCallback((step) => {
        let valueInt = Number.parseFloat(value)
        let stepInt = Number.parseFloat(step)

        if (Number.isNaN(valueInt)) {
            valueInt = 0
        }
        if (Number.isNaN(stepInt)) {
            stepInt = 1
        }

        let newValue = valueInt + stepInt

        if (props.min && newValue < props.min) {
            newValue = props.min
        }
        if (props.max && newValue > props.max) {
            newValue = props.max
        }

        setValue(newValue)
    }, [props.min, props.max, value])

    const onIncrease = useCallback(() => {
        const step = props.step || 1
        addValue(step)
    }, [addValue, props.step])

    const onDecrease = useCallback(() => {
        const step = -(props.step || 1)
        addValue(step)
    }, [addValue, props.step])

    return (
        <React.Fragment>
            <input
                {...props}
                value={value || ''}
                onChange={(event) => setValue(event.target.value)}
                className={cx(className, styles.root)}
            />
            {!hideButtons && props.type === 'number' && (
                <div className={styles.buttonContainer}>
                    <button type="button" className={styles.numberButton} onClick={onIncrease}><SvgIcon name="caretUp" /></button>
                    <button type="button" className={styles.numberButton} onClick={onDecrease}><SvgIcon name="caretDown" /></button>
                </div>
            )}
        </React.Fragment>
    )
}

NumberField.defaultProps = {
    hideButtons: false,
}

export default NumberField
