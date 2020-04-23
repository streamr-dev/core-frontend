// @flow

import styled from 'styled-components'

export const Link = styled.a`
    color: #${({ active }) => (active ? '0324ff' : '323232')} !important;
`

const TOCNav = styled.div`
    font-size: 16px;
    line-height: 2em;
    margin-top: 72px; /* Line up with TOCSection's title. */
    position: sticky;
    text-align: right;
    top: 164px;

    a {
        display: block;
    }
`

export default TOCNav
