// @flow

import '$shared/styles/pcss'
import { ThemeProvider } from 'styled-components'
import { NavProvider } from '@streamr/streamr-layout'

import React from 'react'
import cx from 'classnames'

import useScrollToTop from '$shared/hooks/useScrollToTop'
import Nav from './Nav'
import Footer from './Footer'
import styles from './layout.pcss'

type Props = {
    theme?: any,
    footer?: boolean,
    nav?: any,
    framedClassname?: string,
    innerClassname?: string,
}

const DefaultTheme = {}

const Layout = ({
    theme = DefaultTheme,
    footer = true,
    nav = <Nav />,
    framedClassname,
    innerClassname,
    ...props
}: Props = {}) => {
    useScrollToTop()

    return (
        <ThemeProvider theme={theme}>
            <NavProvider>
                <div className={cx(styles.framed, framedClassname)}>
                    <div className={cx(styles.inner, innerClassname)}>
                        {nav}
                        <div {...props} />
                    </div>
                    {!!footer && <Footer />}
                </div>
            </NavProvider>
        </ThemeProvider>
    )
}

export default Layout
