import React from 'react'
import styled, { css, createGlobalStyle } from 'styled-components'

const Layout = createGlobalStyle`
    ${({ inspectorWidth: iw }) => css`
        :root {
            --LiveDataInspectorWidth: ${iw}px;
        }
    `}
`

const UnstyledPusher = ({ className, minWidth = 108 }) => (
    <div className={className}>
        <div
            // eslint-disable-next-line react/jsx-curly-brace-presence
            css={`
                max-width: calc(100vw - var(--LiveDataInspectorWidth, 504px));
                width: ${minWidth}px;
            `}
        />
        <div
            // eslint-disable-next-line react/jsx-curly-brace-presence
            css={`
                width: calc((100vw - 1108px - var(--LiveDataInspectorWidth, 504px)) / 2 - ${minWidth}px - ${108 - minWidth}px);
            `}
        />
    </div>
)

const Pusher = styled(UnstyledPusher)`
    display: grid;
    grid-template-columns: auto auto;
`

Object.assign(Layout, {
    Pusher,
})

export default Layout
