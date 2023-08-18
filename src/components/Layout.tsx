import React, { ReactNode } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Nav from '~/shared/components/Layout/Nav'
import Footer from '~/shared/components/Layout/Footer'
import useScrollToTop from '~/shared/hooks/useScrollToTop'
import Helmet from './Helmet'

export default function Layout({
    children,
    footer = <Footer />,
    nav = <Nav />,
    pageTitle,
    innerBackgroundColor,
    outerBackgroundColor,
    rootBackgroundColor = '#f5f5f5',
}: {
    children?: ReactNode
    footer?: ReactNode
    nav?: ReactNode
    pageTitle?: string
    innerBackgroundColor?: string
    outerBackgroundColor?: string
    rootBackgroundColor?: string
}) {
    useScrollToTop()

    return (
        <>
            {pageTitle && <Helmet title={pageTitle} />}
            <GlobalStyles />
            <LayoutRoot $bg={rootBackgroundColor}>
                <LayoutOuter $bg={outerBackgroundColor}>
                    {nav}
                    <LayoutInner $bg={innerBackgroundColor}>{children}</LayoutInner>
                </LayoutOuter>
                {footer}
            </LayoutRoot>
        </>
    )
}

export const LayoutRoot = styled.main<{ $bg?: string }>`
    background-color: ${({ $bg }) => $bg};
    color: #323232;
`

export const LayoutOuter = styled.div<{ $bg?: string }>`
    background-color: ${({ $bg }) => $bg};
    display: flex;
    flex-direction: column;
    font-size: 16px;
    min-height: 100vh;
    position: relative;
    z-index: 1;
`

export const LayoutInner = styled.div<{ $bg?: string }>`
    background-color: ${({ $bg }) => $bg};
`

const GlobalStyles = createGlobalStyle`
    strong {
        font-weight: 500;
    }
`
