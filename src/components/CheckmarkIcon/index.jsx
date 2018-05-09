// @flow

import React from 'react'
import classNames from 'classnames'
import styles from './checkmarkIcon.pcss'

export type IconSize = 'small' | 'large'

type Props = {
    size?: IconSize,
    className?: string,
}

const CheckmarkIcon = ({ size, className }: Props) => {
    if (size) {
        return <span className={classNames(className, styles[size], styles.checkmark)} />
    }
    return null
}

export default CheckmarkIcon
