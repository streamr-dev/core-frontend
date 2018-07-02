// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import { Nav as FrameNav, NavLink, NavDivider, NavLabel, NavDropdown } from '@streamr/streamr-layout'

import links from '../../links'
import type { User } from '../../flowtype/user-types'
import { getLoginUrl } from '../../utils/login'

import AccountCircle from './AccountCircle'

type Props = {
    currentUser: ?User,
    logout: () => void,
    opaque?: boolean,
    expand?: boolean,
    location: Location
}

const AccountElementMobile = ({ closeNav, currentUser }: { closeNav?: () => void, currentUser: ?User }) => (
    <Link to={links.myPurchases} onClick={closeNav}>
        <AccountCircle currentUser={currentUser} />
    </Link>
)

class Nav extends React.Component<Props> {
    getLoginLink = () => getLoginUrl(this.props.location.pathname)
    render() {
        const { currentUser, logout } = this.props

        return (
            <FrameNav label="Marketplace" expand {...this.props}>
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
                {currentUser && (
                    <NavLink mobile href={links.profile}>
                        Profile
                    </NavLink>
                )}
                {currentUser && (
                    <AccountElementMobile mobile currentUser={currentUser} />
                )}
                {currentUser && (
                    <NavLink mobile href={links.logout} onClick={logout}>
                        Logout
                    </NavLink>
                )}
                {!currentUser && (
                    <NavLink mobile href={this.getLoginLink()}>
                        Sign In
                    </NavLink>
                )}
                {!currentUser && (
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
                {!!currentUser && (
                    <NavDropdown
                        label={(
                            <AccountCircle currentUser={currentUser} />
                        )}
                        align="left"
                    >
                        <a href={links.profile}>
                            Profile
                        </a>
                        <a href={links.logout} onClick={logout}>
                            Logout
                        </a>
                    </NavDropdown>
                )}
                {!currentUser && (
                    <NavLink desktop href={this.getLoginLink()}>
                        Sign In
                    </NavLink>
                )}
                {!currentUser && (
                    <NavLink desktop outline href={links.signup}>
                        Sign Up
                    </NavLink>
                )}
            </FrameNav>
        )
    }
}

export default withRouter(Nav)
