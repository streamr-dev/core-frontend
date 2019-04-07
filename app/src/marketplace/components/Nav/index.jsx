// @flow

import React from 'react'
import { NavLink as Link, withRouter, type Location } from 'react-router-dom'
import { I18n, Translate } from 'react-redux-i18n'
import FrameNav, { NavLink, NavDivider, NavLabel, NavDropdown } from '$shared/components/Nav'

import links from '../../../links'
import type { User } from '$shared/flowtype/user-types'
import { formatPath } from '$shared/utils/url'
import AvatarCircle from '$shared/components/AvatarCircle'
import { getLoginUrl } from '../../utils/login'
import routes from '$routes'

import styles from './nav.pcss'

type Props = {
    currentUser: ?User,
    opaque?: boolean,
    expand?: boolean,
    location: Location
}

const AccountElementMobile = ({ closeNav, currentUser }: { closeNav?: () => void, currentUser: ?User }) => (
    <Link to={links.userpages.purchases} onClick={closeNav}>
        <AvatarCircle
            name={(currentUser && currentUser.name) || ''}
            imageUrl={(currentUser && currentUser.imageUrlSmall) || ''}
            className={styles.accountCircle}
        />
    </Link>
)

class Nav extends React.Component<Props> {
    getLoginLink = () => getLoginUrl(this.props.location.pathname)

    render() {
        const { currentUser } = this.props

        return (
            <FrameNav label={I18n.t('general.marketplace')} expand {...this.props}>
                <NavDropdown align="center" label={I18n.t('general.marketplace')}>
                    <Link to={formatPath(links.marketplace.main)}>
                        <Translate value="general.browse" />
                    </Link>
                    <Link to={formatPath(links.userpages.purchases)}>
                        <Translate value="general.myPurchases" />
                    </Link>
                    <Link to={formatPath(links.userpages.products)}>
                        <Translate value="general.myProducts" />
                    </Link>
                </NavDropdown>
                <NavLink mobile to={formatPath(links.marketplace.main)}>
                    <Translate value="general.browse" />
                </NavLink>
                <NavDropdown align="center" label={I18n.t('general.editor')}>
                    <Link to={formatPath(links.editor.canvasEditor)}>
                        <Translate value="general.newCanvas" />
                    </Link>
                    <Link to={formatPath(links.userpages.canvases)}>
                        <Translate value="general.canvases" />
                    </Link>
                    <Link to={formatPath(links.userpages.dashboards)}>
                        <Translate value="general.dashboards" />
                    </Link>
                    <Link to={formatPath(links.userpages.streams)}>
                        <Translate value="general.streams" />
                    </Link>
                </NavDropdown>
                <NavDivider />
                <NavLink mobile to={formatPath(links.userpages.purchases)}>
                    <Translate value="general.myPurchases" />
                </NavLink>
                <NavLink mobile to={formatPath(links.userpages.products)}>
                    <Translate value="general.myProducts" />
                </NavLink>
                <NavDivider />
                {currentUser && (
                    <NavLink mobile to={links.userpages.profile}>
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
                    <NavLink mobile href={this.getLoginLink()}>
                        <Translate value="general.signIn" />
                    </NavLink>
                )}
                {!currentUser && (
                    <NavLink mobile outline href={routes.oldSignUp()}>
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
                            <AvatarCircle
                                navBar
                                name={currentUser.name}
                                imageUrl={currentUser.imageUrlSmall}
                            />
                        )}
                        align="left"
                    >
                        <Link to={links.userpages.profile}>
                            <Translate value="general.profile" />
                        </Link>
                        <Link to={routes.logout()}>
                            <Translate value="general.logout" />
                        </Link>
                    </NavDropdown>
                )}
                {!currentUser && (
                    <NavLink desktop href={this.getLoginLink()}>
                        <Translate value="general.signIn" />
                    </NavLink>
                )}
                {!currentUser && (
                    <NavLink desktop outline href={routes.oldSignUp()}>
                        <Translate value="general.signUp" />
                    </NavLink>
                )}
            </FrameNav>
        )
    }
}

export default withRouter(Nav)
