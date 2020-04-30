// @flow

import React, { useCallback } from 'react'
import cx from 'classnames'

import styles from './slider.pcss'

type Props = {
    min: number,
    max: number,
    value: number,
    onChange?: (value: number) => void,
    className?: string,
    sliderClassname?: string,
    disabled?: boolean,
}

const Slider = ({
    min,
    max,
    value,
    className,
    sliderClassname,
    onChange: onChangeProp,
    disabled,
}: Props) => {
    const onChange = useCallback((e: SyntheticInputEvent<HTMLInputElement>) => {
        if (onChangeProp) {
            onChangeProp(parseInt(e.currentTarget.value, 10))
        }
    }, [onChangeProp])

    return (
        <div className={cx(styles.container, className)}>
            <input
                className={cx(styles.sliderInput, sliderClassname)}
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    )
}

export default Slider
