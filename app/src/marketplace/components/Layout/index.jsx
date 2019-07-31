// @flow

import '../../styles/pcss'

import React from 'react'

import MobileNav from '$shared/components/MobileNav'
import Nav from '$shared/components/Nav'
import Footer from './Footer'
import styles from './layout.pcss'

type Props = {
    footer?: boolean,
}

const Layout = ({ footer = true, ...props }: Props = {}) => (
    <div className={styles.framed}>
        <div className={styles.inner}>
            <Nav className={styles.desktopNav} />
            <MobileNav className={styles.mobileNav} />
            <div {...props} />
        </div>
        {!!footer && <Footer />}
    </div>
)

export default Layout
