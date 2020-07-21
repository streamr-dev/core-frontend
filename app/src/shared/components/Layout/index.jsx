// @flow

import '$shared/styles/pcss'
import { ThemeProvider } from 'styled-components'

import React from 'react'
import cx from 'classnames'

import useScrollToTop from '$shared/hooks/useScrollToTop'
import Nav from './Nav'
import Footer from './Footer'
import styles from './layout.pcss'

type Props = {
    theme?: any,
    footer?: boolean,
    nav?: boolean,
    hideNavOnDesktop?: boolean,
    framedClassname?: string,
    innerClassname?: string,
}

const DefaultTheme = {}

const Layout = ({
    theme = DefaultTheme,
    footer = true,
    nav = true,
    hideNavOnDesktop: noDesktopNav = false,
    framedClassname,
    innerClassname,
    ...props
}: Props = {}) => {
    useScrollToTop()

    return (
        <ThemeProvider theme={theme}>
            <div className={cx(styles.framed, framedClassname)}>
                <div className={cx(styles.inner, innerClassname)}>
                    <Nav noNarrow={!nav} noWide={!nav || !!noDesktopNav} />
                    <div {...props} />
                </div>
                {!!footer && <Footer />}
            </div>
        </ThemeProvider>
    )
}

export default Layout
