// @flow

// TODO: Extract this component to streamr-layout.
//       It's meant to be shared.

import React from 'react'
import classNames from 'classnames'

import styles from './icon.pcss'

type Props = {
    name: string,
    className?: string
}

const Icon = ({ name, className, ...props }: Props) => (
    <span
        {...props}
        className={classNames(className, `icon-${name}`, styles.icon)}
    />
)

export default Icon
