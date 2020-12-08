import React from 'react'
import { Link } from 'react-router-dom'
import { Logo as StreamrLogo } from '@streamr/streamr-layout'
import styled from 'styled-components'

import routes from '$routes'

const StyledLink = styled(Link)`
    display: block;
    margin: 0 auto;
    user-select: none;
    width: 32px;
    outline: 0 !important;

    svg {
        color: #FF5C00;
    }
`

const UnstyledLogo = ({ className, ...props }) => (
    <div {...props}>
        <StyledLink to={routes.root()}>
            <StreamrLogo />
        </StyledLink>
    </div>
)

const Logo = styled(UnstyledLogo)`
`

export default Logo
