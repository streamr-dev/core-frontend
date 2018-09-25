// @flow

import React from 'react'
import cx from 'classnames'
import { Link as RouterLink } from 'react-router-dom'

import styles from './link.pcss'

type Props = {
    className?: string,
    href?: string,
}

const Link = ({ className, ...props }: Props) => {
    const Tag = props.href ? 'a' : RouterLink

    return (
        <Tag
            {...props}
            className={cx(styles.root, className)}
        />
    )
}

export default Link
