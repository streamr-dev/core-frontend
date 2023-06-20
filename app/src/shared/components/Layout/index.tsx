import styled, { css } from 'styled-components'
import { ThemeProvider } from 'styled-components'
import React, { FunctionComponent, ReactNode } from 'react'
import { NavProvider } from '@streamr/streamr-layout'
import cx from 'classnames'
import { COLORS, MAX_BODY_WIDTH } from '$shared/utils/styled'
import useScrollToTop from '$shared/hooks/useScrollToTop'
import useCurrentLocation from '$shared/hooks/useCurrentLocation'
import Nav from './Nav'
import Footer from './Footer'
import styles from './layout.pcss'

const Inner = styled.div<{ $gray?: boolean }>`
    background-color: white;

    ${({ $gray = false }) =>
        $gray &&
        css`
            background-color: #f5f5f5;
        `}
`

const DefaultTheme = {}

type LayoutProps = {
    theme?: any
    footer?: boolean
    nav?: ReactNode
    framedClassName?: string
    innerClassName?: string
    children?: ReactNode | ReactNode[]
    className?: string
    gray?: boolean
}

const Layout: FunctionComponent<LayoutProps> = ({
    theme = DefaultTheme,
    footer = true,
    nav = <Nav />,
    framedClassName,
    innerClassName,
    gray = false,
    ...props
}: LayoutProps = {}) => {
    useScrollToTop()
    const current = useCurrentLocation()
    return (
        <ThemeProvider theme={theme}>
            <NavProvider highlight={current}>
                <div className={cx(styles.framed, framedClassName)}>
                    <Inner className={cx(styles.inner, innerClassName)} $gray={gray}>
                        {nav}
                        <div {...props} />
                    </Inner>
                    {!!footer && <Footer />}
                </div>
            </NavProvider>
        </ThemeProvider>
    )
}

export default Layout

export const PageContainer = styled.div`
    background-color: ${COLORS.secondary};
    max-width: ${MAX_BODY_WIDTH}px;
    margin: 0 auto;
    color: ${COLORS.primary};
    padding: 0 24px;
    @media (min-width: ${MAX_BODY_WIDTH + 48}px) {
        padding: 0;
    }
`
