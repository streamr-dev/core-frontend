// @flow

import url from 'url'
import React from 'react'
import { Nav as FrameNav, NavLink, NavDivider } from '../Frame'

import links from '../../links'

type Props = {
    opaque?: boolean,
    expand?: boolean,
}

const Nav = (props: Props) => (
    <FrameNav {...props}>
        <NavLink href="/">
            Top
        </NavLink>
        <NavLink mobile href={url.resolve(links.streamrSite, '#team')}>
            Team
        </NavLink>
        <NavLink href={url.resolve(links.streamrSite, '/faq')}>
            FAQ
        </NavLink>
        <NavDivider />
        <NavLink mobile href={url.resolve(links.streamrSite, '#contact')}>
            Message us
        </NavLink>
        <NavLink mobile href="https://reddit.com/r/streamr">
            Reddit
        </NavLink>
        <NavLink mobile href="https://chat.streamr.com">
            Rocket Chat
        </NavLink>
        <NavLink mobile href={url.resolve(links.streamrSite, 'whitepaper')}>
            Whitepaper
        </NavLink>
        <NavLink mobile href="https://twitter.com/streamrinc">
            Twitter
        </NavLink>
        <NavLink href="https://medium.com/streamrblog">
            Blog
        </NavLink>
        <NavDivider />
        <NavLink href={links.account}>
            Account
        </NavLink>
    </FrameNav>
)

export default Nav
