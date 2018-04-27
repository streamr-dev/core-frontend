// @flow

import React from 'react'
import { Nav as FrameNav, NavLink, NavDivider, NavLabel } from '../Frame'
import links from '../../links'

import AccountLink from './AccountLink'

type Props = {
    opaque?: boolean,
    expand?: boolean,
}

const Nav = (props: Props) => (
    <FrameNav expand {...props}>
        <NavLink desktop href="/">
            Marketplace
        </NavLink>
        <NavLink mobile href="/">
            Browse
        </NavLink>
        <NavLink desktop href={links.editor}>
            Editor
        </NavLink>
        <NavDivider />
        <NavLink mobile href={links.myPurchases}>
            Purchases
        </NavLink>
        <NavLink mobile href={links.myProducts}>
            My Products
        </NavLink>
        <NavDivider />
        <NavLink mobile href={links.profile}>
            Profile
        </NavLink>
        <AccountLink mobile />
        <NavLink mobile href={links.logout}>
            Logout
        </NavLink>
        <NavDivider />
        <NavLabel value="Contact Us" />
        <NavLink mobile href={links.contactGeneral}>
            General
        </NavLink>
        <NavLink mobile href={links.contactMedia}>
            Media
        </NavLink>
        <NavLink mobile href={links.contactJobs}>
            Jobs
        </NavLink>
        <NavLink mobile href={links.contactLabs}>
            Labs
        </NavLink>
        <NavDivider />
        <AccountLink desktop />
    </FrameNav>
)

export default Nav
