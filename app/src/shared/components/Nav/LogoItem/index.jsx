// @flow

import React from 'react'

import Logo from '$shared/components/Logo'
import styles from './logoItem.pcss'

const LogoItem = () => (
    <a
        href={process.env.PLATFORM_ORIGIN_URL}
        className={styles.root}
    >
        <Logo />
    </a>
)

export default LogoItem
