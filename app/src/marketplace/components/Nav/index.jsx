// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import { Nav as FrameNav, NavLink, NavDivider, NavLabel, NavDropdown, I18n, Translate } from '@streamr/streamr-layout'

import links from '../../links'
import type { User } from '../../flowtype/user-types'
import { formatPath } from '../../utils/url'
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
            <FrameNav label={I18n.t('general.marketplace')} expand {...this.props}>
                <NavDropdown align="center" label={I18n.t('general.marketplace')}>
                    <Link to={formatPath(links.main)}>
                        <Translate value="general.browse" />
                    </Link>
                    <Link to={formatPath(links.myPurchases)}>
                        <Translate value="general.myProducts" />
                    </Link>
                    <Link to={formatPath(links.myProducts)}>
                        <Translate value="general.myPurchases" />
                    </Link>
                </NavDropdown>
                <NavLink mobile to={formatPath(links.main)}>
                    <Translate value="general.browse" />
                </NavLink>
                <NavDropdown align="center" label={I18n.t('general.editor')}>
                    <a href={links.newCanvas}>
                        <Translate value="general.newCanvas" />
                    </a>
                    <a href={links.canvasList}>
                        <Translate value="general.canvases" />
                    </a>
                    <a href={links.dashboardList}>
                        <Translate value="general.dashboards" />
                    </a>
                    <a href={links.streamList}>
                        <Translate value="general.streams" />
                    </a>
                </NavDropdown>
                <NavDivider />
                <NavLink mobile to={formatPath(links.myPurchases)}>
                    <Translate value="general.myPurchases" />
                </NavLink>
                <NavLink mobile to={formatPath(links.myProducts)}>
                    <Translate value="general.myProducts" />
                </NavLink>
                <NavDivider />
                {currentUser && (
                    <NavLink mobile href={formatPath(links.profile)}>
                        <Translate value="general.profile" />
                    </NavLink>
                )}
                {currentUser && (
                    <AccountElementMobile mobile currentUser={currentUser} />
                )}
                {currentUser && (
                    <NavLink mobile href={formatPath(links.logout)} onClick={logout}>
                        <Translate value="general.logout" />
                    </NavLink>
                )}
                {!currentUser && (
                    <NavLink mobile href={this.getLoginLink()}>
                        <Translate value="general.signIn" />
                    </NavLink>
                )}
                {!currentUser && (
                    <NavLink mobile outline href={links.signup}>
                        <Translate value="general.signUp" />
                    </NavLink>
                )}
                <NavDivider />
                <NavLabel value="Contact Us" />
                <NavLink mobile href={links.contact.general}>
                    <Translate value="general.general" />
                </NavLink>
                <NavLink mobile href={links.contact.media}>
                    <Translate value="general.media" />
                </NavLink>
                <NavLink mobile href={links.contact.jobs}>
                    <Translate value="general.jobs" />
                </NavLink>
                <NavLink mobile href={links.contact.labs}>
                    <Translate value="general.labs" />
                </NavLink>
                <NavDivider />
                {!!currentUser && (
                    <NavDropdown
                        label={(
                            <AccountCircle currentUser={currentUser} />
                        )}
                        align="left"
                    >
                        <a href={formatPath(links.profile)}>
                            <Translate value="general.profile" />
                        </a>
                        <a href={links.logout} onClick={logout}>
                            <Translate value="general.logout" />
                        </a>
                    </NavDropdown>
                )}
                {!currentUser && (
                    <NavLink desktop href={this.getLoginLink()}>
                        <Translate value="general.signIn" />
                    </NavLink>
                )}
                {!currentUser && (
                    <NavLink desktop outline href={links.signup}>
                        <Translate value="general.signUp" />
                    </NavLink>
                )}
            </FrameNav>
        )
    }
}

export default withRouter(Nav)
