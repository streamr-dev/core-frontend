// @flow

import React from 'react'
import { Link, withRouter, type Location } from 'react-router-dom'
import { I18n, Translate } from 'react-redux-i18n'
import FrameNav, { NavLink, NavDivider, NavLabel, NavDropdown } from '$shared/components/Nav'

import links from '../../../links'
import type { User } from '$shared/flowtype/user-types'
import { formatPath } from '$shared/utils/url'
import { getLoginUrl } from '../../utils/login'
import routes from '$routes'

import AccountCircle from './AccountCircle'

type Props = {
    currentUser: ?User,
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
        const { currentUser } = this.props

        return (
            <FrameNav label={I18n.t('general.marketplace')} expand {...this.props}>
                <NavDropdown align="center" label={I18n.t('general.marketplace')}>
                    <Link to={formatPath(links.main)}>
                        <Translate value="general.browse" />
                    </Link>
                    <Link to={formatPath(links.myPurchases)}>
                        <Translate value="general.myPurchases" />
                    </Link>
                    <Link to={formatPath(links.myProducts)}>
                        <Translate value="general.myProducts" />
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
                    <NavLink mobile href={links.profile}>
                        <Translate value="general.profile" />
                    </NavLink>
                )}
                {currentUser && (
                    <AccountElementMobile mobile currentUser={currentUser} />
                )}
                {currentUser && (
                    <NavLink mobile to={routes.logout()}>
                        <Translate value="general.logout" />
                    </NavLink>
                )}
                {!currentUser && (
                    <NavLink mobile to={routes.login()}>
                        <Translate value="general.signIn" />
                    </NavLink>
                )}
                {!currentUser && (
                    <NavLink mobile outline to={routes.signUp()}>
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
                        <a href={links.profile}>
                            <Translate value="general.profile" />
                        </a>
                        <Link to={routes.logout()}>
                            <Translate value="general.logout" />
                        </Link>
                    </NavDropdown>
                )}
                {!currentUser && (
                    <NavLink desktop to={routes.login()}>
                        <Translate value="general.signIn" />
                    </NavLink>
                )}
                {!currentUser && (
                    <NavLink desktop outline to={routes.signUp()}>
                        <Translate value="general.signUp" />
                    </NavLink>
                )}
            </FrameNav>
        )
    }
}

export default withRouter(Nav)
