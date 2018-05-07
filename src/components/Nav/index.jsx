// @flow

import React from 'react'
import { Link } from 'react-router-dom'

import { Nav as FrameNav, NavLink, NavDivider, NavLabel, NavDropdown } from '../Frame'
import links from '../../links'
import type { User } from '../../flowtype/user-types'

import AccountCircle from './AccountCircle'

type Props = {
    currentUser: ?User,
    onLogout: () => void,
    opaque?: boolean,
    expand?: boolean,
}

const AccountElementMobile = ({ closeNav, currentUser }: { closeNav?: () => void, currentUser: ?User }) => (
    <Link to={links.myPurchases} onClick={closeNav}>
        <AccountCircle currentUser={currentUser} />
    </Link>
)

const Nav = (props: Props) => (
    <FrameNav expand {...props}>
        <NavDropdown align="center" label="Marketplace">
            <Link to="/">
                Browse
            </Link>
            <Link to={links.myPurchases}>
                Purchases
            </Link>
            <Link to={links.myProducts}>
                My Products
            </Link>
        </NavDropdown>
        <NavLink mobile to="/">
            Browse
        </NavLink>
        <NavDropdown align="center" label="Editor">
            <a href={links.newCanvas}>
                New Canvas
            </a>
            <a href={links.canvasList}>
                Canvases
            </a>
            <a href={links.dashboardList}>
                Dashboards
            </a>
            <a href={links.streamList}>
                Streams
            </a>
        </NavDropdown>
        <NavDivider />
        <NavLink mobile to={links.myPurchases}>
            Purchases
        </NavLink>
        <NavLink mobile to={links.myProducts}>
            My Products
        </NavLink>
        <NavDivider />
        {props.currentUser && (
            <NavLink mobile href={links.profile}>
                Profile
            </NavLink>
        )}
        {props.currentUser && (
            <AccountElementMobile mobile currentUser={props.currentUser} />
        )}
        {props.currentUser && (
            <NavLink mobile href="#" onClick={props.onLogout}>
                Logout
            </NavLink>
        )}
        {!props.currentUser && (
            <NavLink mobile href={links.login}>
                Sign In
            </NavLink>
        )}
        {!props.currentUser && (
            <NavLink mobile outline href={links.signup}>
                Sign Up
            </NavLink>
        )}
        <NavDivider />
        <NavLabel value="Contact Us" />
        <NavLink mobile href={links.contact.general}>
            General
        </NavLink>
        <NavLink mobile href={links.contact.media}>
            Media
        </NavLink>
        <NavLink mobile href={links.contact.jobs}>
            Jobs
        </NavLink>
        <NavLink mobile href={links.contact.labs}>
            Labs
        </NavLink>
        <NavDivider />
        {!!props.currentUser && (
            <NavDropdown
                label={(
                    <AccountCircle currentUser={props.currentUser} />
                )}
                align="left"
            >
                <a href={links.profile}>
                    Profile
                </a>
                <a href="#" onClick={props.onLogout}>
                    Logout
                </a>
            </NavDropdown>
        )}
        {!props.currentUser && (
            <NavLink desktop href={links.login}>
                Sign In
            </NavLink>
        )}
        {!props.currentUser && (
            <NavLink desktop outline href={links.signup}>
                Sign Up
            </NavLink>
        )}
    </FrameNav>
)

export default Nav
