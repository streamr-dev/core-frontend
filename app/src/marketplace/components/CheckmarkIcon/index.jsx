// @flow

import React from 'react'
import classNames from 'classnames'
import styles from './checkmarkIcon.pcss'

export type IconSize = 'small' | 'large'

type Props = {
    size?: IconSize,
    className?: string,
}

const CheckmarkIcon = ({ size, className }: Props) => (
    <span className={classNames(className, styles[size], styles.checkmark)} />
)

CheckmarkIcon.defaultProps = {
    size: 'small',
}

export default CheckmarkIcon
