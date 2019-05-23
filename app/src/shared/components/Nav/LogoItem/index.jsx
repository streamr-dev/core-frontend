// @flow

import React from 'react'
import { withRouter, type Location } from 'react-router-dom'
import Link from '$shared/components/Link'
import Logo from '$shared/components/Logo'
import routes from '$routes'
import styles from './logoItem.pcss'

type Props = {
    location: Location,
}

const LogoItem = withRouter(({ location: { pathname } }: Props) => (
    /^\/canvas\/editor\//.test(pathname) ? (
        <Link
            className={styles.root}
            to={routes.canvases()}
        >
            <Logo />
        </Link>
    ) : (
        <a
            className={styles.root}
            href={process.env.PLATFORM_ORIGIN_URL}
        >
            <Logo />
        </a>
    )
))

export default LogoItem
