// @flow

import * as React from 'react'
import { Link as RouterLink } from 'react-router-dom'

type Props = {
    children: React.Node,
    to?: string,
    href?: string,
}

const Link = ({ children, ...props }: Props) => (
    typeof props.to === 'undefined' ? (
        <a href="#" {...props}>
            {children}
        </a>
    ) : (
        <RouterLink {...props}>
            {children}
        </RouterLink>
    )
)

export default Link
