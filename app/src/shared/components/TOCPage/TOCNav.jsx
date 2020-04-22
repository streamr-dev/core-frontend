// @flow

import styled, { css } from 'styled-components'
import { LG } from '$shared/utils/styled'

export const Link = styled.a`
    ${({ active }) => !active && css`
        color: #323232 !important;
    `}

    ${({ onlyDesktop }) => !!onlyDesktop && css`
        @media (max-width: ${LG - 1}px) {
            color: #c4c4c4 !important;
            cursor: default;
            pointer-events: none;
        }
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
