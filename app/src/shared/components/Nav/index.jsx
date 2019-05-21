// @flow

import React from 'react'
import cx from 'classnames'
import { withRouter, type Location } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import { selectUserData } from '$shared/modules/user/selectors'
import type { User } from '$shared/flowtype/user-types'
import Link from '$shared/components/Link'
import LogoItem from './LogoItem'
import DropdownItem from './DropdownItem'
import LinkItem from './LinkItem'
import AvatarItem from './AvatarItem'
import routes from '$routes'
import navigationLinks from '$docs/components/DocsLayout/Navigation/navLinks'

import styles from './nav.pcss'

type StateProps = {
    currentUser: ?User,
}
type Props = StateProps & {
    className?: ?string,
    location: Location,
}

const mapStateToProps = (state): StateProps => ({
    currentUser: selectUserData(state),
})

const Nav = compose(
    connect(mapStateToProps),
    withRouter,
)(({ currentUser, location: { pathname: redirect }, className }: Props) => (
    <nav
        className={cx(styles.root, className)}
    >
        <div>
            <LogoItem />
        </div>
        <div>
            <DropdownItem label={I18n.t('general.core')} to="#" align="right">
                <Link
                    className={Nav.styles.link}
                    to={routes.streams()}
                >
                    <Translate value="general.streams" />
                </Link>
                <Link
                    className={Nav.styles.link}
                    to={routes.canvases()}
                >
                    <Translate value="general.canvases" />
                </Link>
                <Link
                    className={Nav.styles.link}
                    to={routes.dashboards()}
                >
                    <Translate value="general.dashboards" />
                </Link>
                <Link
                    className={Nav.styles.link}
                    to={routes.products()}
                >
                    <Translate value="general.products" />
                </Link>
                <Link
                    className={Nav.styles.link}
                    to={routes.purchases()}
                >
                    <Translate value="general.purchases" />
                </Link>
                <Link
                    className={Nav.styles.link}
                    to={routes.transactions()}
                >
                    <Translate value="general.transactions" />
                </Link>
            </DropdownItem>
            <LinkItem to={routes.marketplace()}>
                <Translate value="general.marketplace" />
            </LinkItem>
            <DropdownItem label={I18n.t('general.docs')} to="#" align="left">
                {Object.keys(navigationLinks).map((key) => (
                    <Link
                        key={key}
                        to={navigationLinks[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={Nav.styles.link}
                    >
                        {key}
                    </Link>
                ))}
            </DropdownItem>
            {!!currentUser && (
                <AvatarItem user={currentUser} />
            )}
            {!currentUser && (
                <LinkItem
                    to={routes.login(redirect !== '/' ? {
                        redirect,
                    } : {})}
                    className={Nav.styles.link}
                >
                    <Translate value="general.signIn" />
                </LinkItem>
            )}
            {!currentUser && (
                <LinkItem
                    to={routes.signUp()}
                    className={cx(Nav.styles.link, Nav.styles.button)}
                >
                    <Translate value="general.signUp" />
                </LinkItem>
            )}
        </div>
    </nav>
))

Nav.styles = styles

export default Nav
