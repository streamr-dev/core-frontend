// @flow

import React from 'react'
import cx from 'classnames'
import Link from '$shared/components/Link'
import Nav from '..'
import styles from './linkItem.pcss'

type Props = {
    className?: ?string,
}

const LinkItem = ({ className, ...props }: Props) => (
    <Link
        {...props}
        className={cx(styles.root, Nav.styles.link, className)}
    />
)

LinkItem.styles = styles

export default LinkItem
