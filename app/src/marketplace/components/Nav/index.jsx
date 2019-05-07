// @flow

import React from 'react'
import { NavLink as Link, withRouter, type Location } from 'react-router-dom'
import { I18n, Translate } from 'react-redux-i18n'
import FrameNav, { NavLink, NavDivider, NavLabel, NavDropdown } from '$shared/components/Nav'

import links from '../../../links'
import type { User } from '$shared/flowtype/user-types'
import { formatPath } from '$shared/utils/url'
import AvatarCircle from '$shared/components/AvatarCircle'
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
            textDisplay
        />
    </Link>
)

// TODO: After rebase and merge convert it into a function.
/* eslint-disable-next-line react/prefer-stateless-function */
class Nav extends React.Component<Props> {
    render() {
        const { currentUser, location } = this.props

        return (
            <FrameNav label={I18n.t('general.marketplace')} expand {...this.props}>
                <NavDropdown align="center" label={I18n.t('general.core')}>
                    <Link to={formatPath(links.userpages.streams)}>
                        <Translate value="general.streams" />
                    </Link>
                    <Link to={formatPath(links.userpages.canvases)}>
                        <Translate value="general.canvases" />
                    </Link>
                    <Link to={formatPath(links.userpages.dashboards)}>
                        <Translate value="general.dashboards" />
                    </Link>
                    <Link to={formatPath(links.userpages.products)}>
                        <Translate value="general.products" />
                    </Link>
                    <Link to={formatPath(links.userpages.purchases)}>
                        <Translate value="general.purchases" />
                    </Link>
                    <Link to={formatPath(links.userpages.transactions)}>
                        <Translate value="general.transactions" />
                    </Link>
                </NavDropdown>
                <NavLink to={formatPath(links.marketplace.main)}>
                    <Translate value="general.marketplace" />
                </NavLink>
                <NavDivider />
                <NavLink mobile to={formatPath(links.userpages.streams)}>
                    <Translate value="general.streams" />
                </NavLink>
                <NavLink mobile to={formatPath(links.userpages.canvases)}>
                    <Translate value="general.canvases" />
                </NavLink>
                <NavLink mobile to={formatPath(links.userpages.dashboards)}>
                    <Translate value="general.dashboards" />
                </NavLink>
                <NavLink mobile to={formatPath(links.userpages.products)}>
                    <Translate value="general.products" />
                </NavLink>
                <NavLink mobile to={formatPath(links.userpages.purchases)}>
                    <Translate value="general.purchases" />
                </NavLink>
                <NavLink mobile to={formatPath(links.userpages.transactions)}>
                    <Translate value="general.transactions" />
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
                    <NavLink
                        mobile
                        to={routes.login({
                            redirect: location.pathname,
                        })}
                    >
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
                            <AvatarCircle
                                name={currentUser.name}
                                imageUrl={currentUser.imageUrlSmall}
                                textDisplay
                            />
                        )}
                        align="left"
                    >
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>
                                {currentUser.name}
                            </div>
                            <div className={styles.userUsername}>
                                {currentUser.username}
                            </div>
                        </div>
                        {null}
                        <Link to={links.userpages.profile} className={styles.sansLink}>
                            <Translate value="general.profile" />
                        </Link>
                        <Link to={`${links.userpages.profile}#api-keys`} className={styles.sansLink}>
                            <Translate value="userpages.profilePage.apiCredentials.linkTitle" />
                        </Link>
                        <Link to={`${links.userpages.profile}#ethereum-accounts`} className={styles.sansLink}>
                            <Translate value="userpages.profilePage.ethereumAddress.linkTitle" />
                        </Link>
                        <Link to={`${links.userpages.profile}#private-keys`} className={styles.sansLink}>
                            <Translate value="userpages.profilePage.ethereumPrivateKeys.linkTitle" />
                        </Link>
                        {null}
                        <Link to={routes.logout()} className={styles.sansLink}>
                            <Translate value="general.logout" />
                        </Link>
                    </NavDropdown>
                )}
                {!currentUser && (
                    <NavLink
                        desktop
                        to={routes.login({
                            redirect: location.pathname,
                        })}
                    >
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
