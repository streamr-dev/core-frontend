// @flow

import React from 'react'
import Link from '$shared/components/Link'
import Logo from '$shared/components/Logo'
import routes from '$routes'
import styles from './logoItem2.pcss'

const LogoItem = () => (
    <Link
        to={routes.root()}
        className={styles.root}
    >
        <Logo />
    </Link>
)

export default LogoItem
