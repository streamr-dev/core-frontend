// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'

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
    location: Location
}

const AccountElementMobile = ({ closeNav, currentUser }: { closeNav?: () => void, currentUser: ?User }) => (
    <Link to={links.myPurchases} onClick={closeNav}>
        <AccountCircle currentUser={currentUser} />
    </Link>
)

class Nav extends React.Component<Props> {
    getLoginLink = () => {
        const path = formatPath('login', 'external', {
            redirect: formatPath(this.props.location.pathname, '/'), // this ensures trailing slash
        })
        const redirect = `${process.env.MARKETPLACE_URL}${path}`

        return `${links.login}?redirect=${encodeURIComponent(redirect)}`
    }
    render() {
        return (
            <FrameNav expand {...this.props}>
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
                {this.props.currentUser && (
                    <NavLink mobile href={links.profile}>
                        Profile
                    </NavLink>
                )}
                {this.props.currentUser && (
                    <AccountElementMobile mobile currentUser={this.props.currentUser} />
                )}
                {this.props.currentUser && (
                    <NavLink mobile href={links.logout} onClick={this.props.logout}>
                        Logout
                    </NavLink>
                )}
                {!this.props.currentUser && (
                    <NavLink mobile href={this.getLoginLink()}>
                        Sign In
                    </NavLink>
                )}
                {!this.props.currentUser && (
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
                {!!this.props.currentUser && (
                    <NavDropdown
                        label={(
                            <AccountCircle currentUser={this.props.currentUser} />
                        )}
                        align="left"
                    >
                        <a href={links.profile}>
                            Profile
                        </a>
                        <a href={links.logout} onClick={this.props.logout}>
                            Logout
                        </a>
                    </NavDropdown>
                )}
                {!this.props.currentUser && (
                    <NavLink desktop href={this.getLoginLink()}>
                        Sign In
                    </NavLink>
                )}
                {!this.props.currentUser && (
                    <NavLink desktop outline href={links.signup}>
                        Sign Up
                    </NavLink>
                )}
            </FrameNav>
        )
    }
}

export default withRouter(Nav)
