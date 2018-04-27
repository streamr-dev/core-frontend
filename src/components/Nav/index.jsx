// @flow

import React from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { Button } from '@streamr/streamr-layout'

import { Nav as FrameNav, NavLink, NavDivider, NavLabel, NavDropdown } from '../Frame'
import links from '../../links'
import type { User } from '../../flowtype/user-types'

import AccountCircle from './AccountCircle'
import styles from './nav.pcss'

type Props = {
    currentUser: ?User,
    opaque?: boolean,
    expand?: boolean,
}

const AccountElementMobile = ({ closeNav, opaque, currentUser }: { closeNav?: () => void, opaque?: boolean, currentUser: ?User }) => (
    <Link to={links.myPurchases} opaqueNav={opaque} className={styles.accountCircleLink} onClick={closeNav}>
        <AccountCircle currentUser={currentUser} />
    </Link>
)

const Nav = (props: Props) => (
    <FrameNav expand className={styles.nav} {...props}>
        <NavDropdown label="Marketplace">
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
        <NavLink mobile href="/">
            Browse
        </NavLink>
        <NavDropdown label="Editor">
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
        <NavLink mobile href={links.myPurchases}>
            Purchases
        </NavLink>
        <NavLink mobile href={links.myProducts}>
            My Products
        </NavLink>
        <NavDivider />
        {props.currentUser && (
            <NavLink mobile href={links.profile}>
                Profile
            </NavLink>
        )}
        {props.currentUser && (
            <AccountElementMobile mobile opaque={props.opaque} currentUser={props.currentUser} />
        )}
        {props.currentUser && (
            <NavLink mobile href={links.logout}>
                Logout
            </NavLink>
        )}
        {!props.currentUser && (
            <NavLink mobile href={links.profile}>
                Sign Up
            </NavLink>
        )}
        {!props.currentUser && (
            <NavLink mobile href={links.logout}>
                Sign In
            </NavLink>
        )}
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
        {!!props.currentUser && (
            <NavDropdown
                label={(
                    <AccountCircle currentUser={props.currentUser} />
                )}
                pullLeft
            >
                <a href={links.profile}>
                    Profile
                </a>
                {/* TODO: Decide what do do with this link */}
                <a href={links.logout}>
                    Logout
                </a>
            </NavDropdown>
        )}
        {!props.currentUser && (
            <NavLink desktop href={links.login} opaqueNav={props.opaque}>
                Sign In
            </NavLink>
        )}
        {!props.currentUser && (
            <div className={classnames(styles.signupButtonContainer, 'hidden-sm-down')}>
                <a href={links.signup}>
                    <Button
                        outline
                        className={styles.signupButton}
                        size="sm"
                    >
                        Sign Up
                    </Button>
                </a>
            </div>
        )}
    </FrameNav>
)

export default Nav
