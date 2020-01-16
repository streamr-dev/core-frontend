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
    nav?: boolean,
    hideNavOnDesktop?: boolean,
    navShadow?: boolean,
}

const Layout = ({
    footer = true,
    nav = true,
    hideNavOnDesktop = false,
    navShadow = false,
    ...props
}: Props = {}) => (
    <div className={styles.framed}>
        <div className={styles.inner}>
            {!!nav && (
                <React.Fragment>
                    <Nav
                        className={cx(styles.desktopNav, {
                            [styles.hideNavOnDesktop]: !!hideNavOnDesktop,
                            [Nav.styles.shadow]: !!navShadow,
                        })}
                    />
                    <MobileNav className={styles.mobileNav} />
                </React.Fragment>
            )}
            <div {...props} />
        </div>
        {!!footer && <Footer />}
    </div>
)

export default Layout
