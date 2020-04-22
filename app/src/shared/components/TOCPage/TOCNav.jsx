// @flow

import styled, { css } from 'styled-components'

export const Link = styled.a`
    ${({ active }) => !active && css`
        color: #323232 !important;
    `}
`

const TOCNav = styled.div`
    font-size: 16px;
    line-height: 2em;
    margin-top: 71px; /* Line up with TOCSection's title. */
    position: sticky;
    text-align: right;
    top: 164px;

    a {
        display: block;
    }
`

export default TOCNav
