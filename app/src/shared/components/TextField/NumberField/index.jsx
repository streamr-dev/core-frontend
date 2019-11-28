// @flow

import React, { useCallback, useRef } from 'react'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'

import styles from '../textField.pcss'

type Props = {
    className?: string,
    onAutoComplete?: (boolean) => void,
    type?: string,
    min?: number,
    max?: number,
    step?: number,
    hideButtons?: boolean,
}

const NumberField = ({ className, onAutoComplete, hideButtons, ...props }: Props) => {
    const inputRef = useRef(null)

    const onAnimationStart = useCallback(({ animationName }: SyntheticAnimationEvent<EventTarget>) => {
        if (onAutoComplete && (animationName === styles.onAutoFillStart || animationName === styles.onAutoFillCancel)) {
            onAutoComplete(animationName === styles.onAutoFillStart)
        }
    }, [onAutoComplete])

    const addValue = useCallback((step) => {
        if (inputRef.current) {
            const { value } = inputRef.current
            let valueInt = parseInt(value, 10)
            let stepInt = parseInt(step, 10)

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

            /* eslint-disable-next-line no-param-reassign */
            // $FlowFixMe: inputRef.current is checked at the top
            inputRef.current.value = newValue
        }
    }, [props.min, props.max])

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
                className={cx(className, styles.root)}
                onAnimationStart={onAnimationStart}
                ref={inputRef}
            />
            {!hideButtons && props.type === 'number' && (
                <div className={styles.buttonContainer}>
                    <button className={styles.numberButton} onClick={onIncrease}><SvgIcon name="caretUp" /></button>
                    <button className={styles.numberButton} onClick={onDecrease}><SvgIcon name="caretDown" /></button>
                </div>
            )}
        </React.Fragment>
    )
}

NumberField.defaultProps = {
    hideButtons: false,
}

export default NumberField
