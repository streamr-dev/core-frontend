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

const LogoItem = withRouter(({ location: { pathname } }: Props) => {
    const location = /^\/canvas\/editor\//.test(pathname) ? routes.canvases() : process.env.PLATFORM_ORIGIN_URL

    return (
        <Link
            to={location}
            className={styles.root}
        >
            <Logo />
        </Link>
    )
})

export default LogoItem
