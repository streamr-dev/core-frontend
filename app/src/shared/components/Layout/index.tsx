import { ThemeProvider } from 'styled-components'
import { NavProvider } from '@streamr/streamr-layout'
import React, { FunctionComponent, ReactNode } from 'react'
import cx from 'classnames'
import useScrollToTop from '$shared/hooks/useScrollToTop'
import useCurrentLocation from '$shared/hooks/useCurrentLocation'
import Nav from './Nav'
import Footer from './Footer'
import styles from './layout.pcss'
type Props = {
    theme?: any
    footer?: boolean
    nav?: any
    framedClassname?: string
    innerClassname?: string
}
const DefaultTheme = {}

type LayoutProps = {
    theme?: any,
    footer?: boolean,
    nav?: ReactNode,
    framedClassName?: string,
    innerClassName?: string,
    children?: ReactNode | ReactNode[],
    className?: string
}
const Layout: FunctionComponent<LayoutProps> = ({
    theme = DefaultTheme,
    footer = true,
    nav = <Nav />,
    framedClassName,
    innerClassName,
    ...props
}: LayoutProps = {}) => {
    useScrollToTop()
    const current = useCurrentLocation()
    return (
        <ThemeProvider theme={theme}>
            <NavProvider highlight={current}>
                <div className={cx(styles.framed, framedClassName)}>
                    <div className={cx(styles.inner, innerClassName)}>
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
