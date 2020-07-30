import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

const UnstyledRaw = (props) => {
    const Tag = props.href || !props.to ? 'a' : RouterLink
    return <Tag {...props} />
}

const Raw = styled(UnstyledRaw)``

const Link = styled(Raw)`
    &,
    :link,
    :active,
    :focus,
    :hover,
    :visited {
        color: inherit;
        outline: 0;
        text-decoration: ${({ decorated }) => (decorated ? 'underline' : 'none')};
    }
`

Object.assign(Link, {
    Raw,
})

export default Link
