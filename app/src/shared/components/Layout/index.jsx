// @flow

import '$shared/styles/pcss'

import React from 'react'
import cx from 'classnames'

import MobileNav from '$shared/components/MobileNav'
import Nav from '$shared/components/Nav'
import Footer from './Footer'
import styles from './layout.pcss'

type Props = {
    footer?: boolean,
    hideNavOnDesktop?: boolean,
}

const Layout = ({ footer = true, hideNavOnDesktop = false, ...props }: Props = {}) => (
    <div className={styles.framed}>
        <div className={styles.inner}>
            <Nav className={cx(styles.desktopNav, {
                [styles.hideNavOnDesktop]: !!hideNavOnDesktop,
            })}
            />
            <MobileNav className={styles.mobileNav} />
            <div {...props} />
        </div>
        {!!footer && <Footer />}
    </div>
)

export default Layout
