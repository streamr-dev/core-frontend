// @flow

import React from 'react'
import { Link } from 'react-router-dom'

import { Nav as FrameNav, NavLink, NavDivider, NavLabel, NavDropdown } from '../Frame'
import links from '../../links'
import type { User } from '../../flowtype/user-types'

import { formatPath } from '../../utils/url'
import AccountCircle from './AccountCircle'

type Props = {
    currentUser: ?User,
    logout: () => void,
    opaque?: boolean,
    expand?: boolean,
}

const AccountElementMobile = ({ closeNav, currentUser }: { closeNav?: () => void, currentUser: ?User }) => (
    <Link to={links.myPurchases} onClick={closeNav}>
        <AccountCircle currentUser={currentUser} />
    </Link>
)

const getLoginLink = () => {
    const path = formatPath('login', 'external', {
        redirect: formatPath(window.location.pathname, '/'), // this ensures trailing slash
    })
    const redirect = `${process.env.MARKETPLACE_URL}${path}`

    return `${links.login}?redirect=${encodeURIComponent(redirect)}`
}

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
            <NavLink mobile href={links.logout} onClick={props.logout}>
                Logout
            </NavLink>
        )}
        {!props.currentUser && (
            <NavLink mobile href={getLoginLink()}>
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
                <a href={links.logout} onClick={props.logout}>
                    Logout
                </a>
            </NavDropdown>
        )}
        {!props.currentUser && (
            <NavLink desktop href={getLoginLink()}>
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
