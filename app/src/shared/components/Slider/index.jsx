// @flow

import React from 'react'
import cx from 'classnames'

import styles from './slider.pcss'

type Props = {
    min: number,
    max: number,
    value: number,
    onChange?: (value: number) => void,
    className?: string,
}

class Slider extends React.Component<Props> {
    onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const { onChange } = this.props

        if (onChange) {
            onChange(parseInt(e.currentTarget.value, 10))
        }
    }

    render() {
        const { min, max, value, className } = this.props

        return (
            <div className={cx(styles.container, className)}>
                <input
                    className={styles.sliderInput}
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={this.onChange}
                />
            </div>
        )
    }
}

export default Slider
