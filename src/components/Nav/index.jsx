// @flow

import url from 'url'
import React from 'react'
import { Link } from 'react-router-dom'
import { Nav as FrameNav, NavLink, NavDropdown, NavDivider } from '../Frame'

import links from '../../links'

type Props = {
    opaque?: boolean,
}

const Nav = ({ opaque }: Props) => (
    <FrameNav opaque={opaque}>
        <NavDropdown to="/" label="Product">
            <Link to={url.resolve(links.streamrSite, '#howItWorks')}>
                How it works
            </Link>
            <Link to="https://www.streamr.com/#streamrSystem">
                Streamr System
            </Link>
            <Link to="https://www.streamr.com/#editor">
                Try the editor
            </Link>
            <Link to="https://www.streamr.com/#team">
                Team
            </Link>
            <Link to="https://www.streamr.com/#contact">
                Contact
            </Link>
        </NavDropdown>
        <NavLink mobile to="https://www.streamr.com/#howItWorks">
            How it works
        </NavLink>
        <NavLink mobile to="https://www.streamr.com/#streamrSystem">
            Streamr System
        </NavLink>
        <NavLink mobile to="https://www.streamr.com/#team">
            Team
        </NavLink>
        <NavLink to="https://www.streamr.com/faq">
            FAQ
        </NavLink>
        <NavDivider />
        <NavLink mobile to="https://www.streamr.com/#contact">
            Message us
        </NavLink>
        <NavLink mobile to="https://reddit.com/r/streamr">
            Reddit
        </NavLink>
        <NavLink mobile to="https://chat.streamr.com">
            Rocket Chat
        </NavLink>
        <NavLink mobile to="https://www.streamr.com/whitepaper">
            Whitepaper
        </NavLink>
        <NavLink mobile to="https://twitter.com/streamrinc">
            Twitter
        </NavLink>
        <NavLink to="https://medium.com/streamrblog">
            Blog
        </NavLink>
        <NavDivider />
        <NavLink to={links.account}>
            Blog
        </NavLink>
    </FrameNav>
)

export default Nav
