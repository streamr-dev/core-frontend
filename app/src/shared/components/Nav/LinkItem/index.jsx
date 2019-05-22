// @flow

import React from 'react'
import cx from 'classnames'
import { withRouter, type Location } from 'react-router-dom'
import Link from '$shared/components/Link'
import Nav from '..'
import styles from './linkItem.pcss'

type Props = {
    className?: ?string,
    location: Location,
    to: string,
}

const LinkItem = withRouter(({
    className,
    history,
    location: { pathname },
    match,
    staticContext,
    to,
    ...props
}: Props) => {
    const [currentLocation] = pathname.split(/\//).filter(Boolean)

    return (
        <Link
            {...props}
            to={to}
            className={cx(styles.root, Nav.styles.link, className, {
                [styles.current]: to.startsWith(`/${currentLocation}`),
            })}
        />
    )
})

LinkItem.styles = styles

export default LinkItem
