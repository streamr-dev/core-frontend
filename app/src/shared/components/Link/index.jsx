// @flow

import React from 'react'
import cx from 'classnames'
import { Link as RouterLink } from 'react-router-dom'

import styles from './link.pcss'

type Props = {
    className?: string,
    href?: string,
    to?: ?string,
    decorated?: boolean,
}

const Link = ({ className, decorated, ...props }: Props) => {
    const Tag = props.href || !props.to ? 'a' : RouterLink
    return (
        <Tag
            {...props}
            className={cx(styles.root, className, {
                [styles.decorated]: !!decorated,
            })}
        />
    )
}

export default Link
