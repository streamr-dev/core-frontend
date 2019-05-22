// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import { withRouter, type Location } from 'react-router-dom'
import Link from '$shared/components/Link'
import Nav from '..'
import LinkItemUnderline from '../LinkItemUnderline'
import styles from './linkItem.pcss'

type Props = {
    children?: Node,
    className?: ?string,
    location: Location,
    to: string,
    underlined?: boolean,
}

const LinkItem = withRouter(({
    children,
    className,
    history,
    location: { pathname },
    match,
    staticContext,
    to,
    underlined,
    ...props
}: Props) => {
    const [currentLocation] = pathname.split(/\//).filter(Boolean)

    return (
        <Link
            {...props}
            to={to}
            className={cx(styles.root, Nav.styles.link, className, LinkItemUnderline.styles.parent, {
                [styles.current]: to.startsWith(`/${currentLocation}`),
            })}
        >
            {children}
            {!!underlined && <LinkItemUnderline />}
        </Link>
    )
})

LinkItem.styles = styles

export default LinkItem
