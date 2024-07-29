import React, { ReactNode } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { DisclaimerBar } from '~/components/DisclaimerBar'
import Footer from '~/components/Footer'
import Helmet from '~/components/Helmet'
import Nav from '~/components/Nav'
import useScrollToTop from '~/shared/hooks/useScrollToTop'
import { MAX_BODY_WIDTH } from '~/shared/utils/styled'

interface LayoutProps {
    children?: ReactNode
    footer?: ReactNode
    nav?: ReactNode
    columnize?: boolean
    pageTitle?: string
    innerBackgroundColor?: string
    outerBackgroundColor?: string
    rootBackgroundColor?: string
    rootComponent?: typeof LayoutRoot
    outerComponent?: typeof LayoutOuter
    innerComponent?: typeof LayoutInner
}

export default function Layout({
    children,
    footer = <Footer />,
    nav = <Nav />,
    columnize = false,
    pageTitle,
    innerBackgroundColor,
    outerBackgroundColor,
    rootBackgroundColor = '#f5f5f5',
    rootComponent: Root = LayoutRoot,
    outerComponent: Outer = LayoutOuter,
    innerComponent: Inner = LayoutInner,
}: LayoutProps) {
    useScrollToTop()

    return (
        <>
            {pageTitle && <Helmet title={pageTitle} />}
            <GlobalStyles />
            <Root $bg={rootBackgroundColor}>
                <Outer $bg={outerBackgroundColor}>
                    <DisclaimerBar />
                    {nav}
                    <Inner $bg={innerBackgroundColor}>
                        {columnize ? <LayoutColumn>{children}</LayoutColumn> : children}
                    </Inner>
                </Outer>
                {footer}
            </Root>
        </>
    )
}

const LayoutRoot = styled.main<{ $bg?: string }>`
    background-color: ${({ $bg }) => $bg};
    color: #323232;
`

const LayoutOuter = styled.div<{ $bg?: string }>`
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
    body {
        font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
        font-size: 16px;
        line-height: 2em;
        -webkit-overflow-scrolling: touch;
    }

    input {
        font-family: inherit;
    }

    body a {
        text-decoration: none;
    }

    p a {
        text-decoration: underline;
    }

    strong {
        font-weight: 500;
    }

    .react-loading-skeleton {
        animation: none !important;
        background: #adadad none;
    }

    a {
        color: #0324FF;
        font-weight: inherit;
    }

    a:link,
    a:active,
    a:focus,
    a:hover,
    a:visited {
        text-decoration: none;
    }

    a:focus,
    a:hover {
        color: #0D009A;
    }

    a:active {
        color: #13013D;
    }
`

export const LayoutColumn = styled.div`
    margin: 0 auto;
    max-width: ${MAX_BODY_WIDTH}px;
    padding: 0 24px;

    @media (min-width: ${MAX_BODY_WIDTH + 48}px) {
        padding: 0;
    }
`
