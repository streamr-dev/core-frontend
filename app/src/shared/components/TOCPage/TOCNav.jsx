import React from 'react'
import styled, { css } from 'styled-components'
import TOCNavContext from './TOCNavContext'

export const Link = styled.a`
    ${({ disabled }) => !!disabled && css`
        pointer-events: none;
        opacity: 0.5;
    `}

    color: ${({ active }) => (active ? '#0324ff' : '#323232')} !important;
`

function UnstyledTOCNav(props) {
    return (
        <TOCNavContext.Provider value>
            <div {...props} />
        </TOCNavContext.Provider>
    )
}

const TOCNav = styled(UnstyledTOCNav)`
    font-size: 16px;
    line-height: 2em;
    margin-top: 0px; /* Line up with TOCSection's title. */
    position: sticky;
    text-align: right;
    top: 164px;

    a {
        display: block;
    }
`

export default TOCNav
