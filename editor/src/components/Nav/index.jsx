// @flow

import React from 'react'
import { connect } from 'react-redux'

import { Link, withRouter, type Location } from 'react-router-dom'

import { Nav as FrameNav, NavLink, NavDivider, NavLabel, NavDropdown } from '@streamr/streamr-layout'
import links from '../../links'
import type { User } from '../../flowtype/user-types'

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
    render() {
        const { currentUser, logout } = this.props

        return (
            <FrameNav label="Editor" expand {...this.props}>
                <NavLink href={links.marketplace}>
                    Marketplace
                </NavLink>
                <NavDropdown align="center" label="Editor">
                    <Link to={links.newCanvas}>
                        New Canvas
                    </Link>
                    <Link to={links.canvasList}>
                        Canvases
                    </Link>
                    <Link to={links.dashboardList}>
                        Dashboards
                    </Link>
                    <Link to={links.streamList}>
                        Streams
                    </Link>
                </NavDropdown>
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
                    <NavLink mobile href={links.login}>
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
                        <Link to={links.profile}>
                            Profile
                        </Link>
                        <a href={links.logout}>
                            Logout
                        </a>
                    </NavDropdown>
                )}
                {!currentUser && (
                    <NavLink desktop href={links.login}>
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

export default connect((state) => ({
    currentUser: state.user.currentUser,
}))(withRouter(Nav))
