// @flow

import React, { type Node, useMemo } from 'react'
import cx from 'classnames'
import { withRouter, type Location } from 'react-router-dom'
import Link from '$shared/components/Link'
import Nav from '..'
import LinkItemUnderline from '../LinkItemUnderline'
import styles from './linkItem.pcss'

type ForeignProps = {
    history?: any,
    match?: any,
    staticContext?: any,
}

type Props = ForeignProps & {
    children?: Node,
    className?: ?string,
    location: Location,
    to: string,
    underlined?: boolean,
}

const getCurrentLocation = (pathname: string): string => {
    if (/^\/(canvas|dashboard)\//.test(pathname)) {
        return 'core'
    }
    return pathname.split(/\//).filter(Boolean)[0] || 'core'
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
    const currentLocation = useMemo(() => getCurrentLocation(pathname), [pathname])

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
