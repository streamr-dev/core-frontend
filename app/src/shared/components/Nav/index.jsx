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
import docsLinks from '$shared/../docsLinks'

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
            <DropdownItem
                align="right"
                label={I18n.t('general.core')}
                to={routes.streams()}
            >
                <Link to={routes.streams()}>
                    <Translate value="general.streams" />
                </Link>
                <Link to={routes.canvases()}>
                    <Translate value="general.canvases" />
                </Link>
                <Link to={routes.dashboards()}>
                    <Translate value="general.dashboards" />
                </Link>
                <Link to={routes.products()}>
                    <Translate value="general.products" />
                </Link>
                <Link to={routes.purchases()}>
                    <Translate value="general.purchases" />
                </Link>
                <Link to={routes.transactions()}>
                    <Translate value="general.transactions" />
                </Link>
            </DropdownItem>
            <LinkItem
                to={routes.marketplace.root()}
                underlined
            >
                <Translate value="general.marketplace" />
            </LinkItem>
            <DropdownItem
                align="left"
                label={I18n.t('general.docs')}
                to={docsLinks.docs}
            >
                {[
                    <Link to={docsLinks.gettingStarted} key="gettingStarted">
                        <Translate value="general.gettingStarted" />
                    </Link>,
                    <Link to={docsLinks.streams} key="streams">
                        <Translate value="general.streams" />
                    </Link>,
                    <Link to={docsLinks.canvases} key="canvases">
                        <Translate value="general.canvases" />
                    </Link>,
                    <Link to={docsLinks.dashboards} key="dashboards">
                        <Translate value="general.dashboards" />
                    </Link>,
                    <Link to={docsLinks.products} key="products">
                        <Translate value="general.products" />
                    </Link>,
                    ...(process.env.DATA_UNIONS_DOCS ? [(
                        <Link to={docsLinks.dataUnions} key="dataUnions">
                            <Translate value="general.dataUnions" />
                        </Link>
                    )] : []),
                ]}
            </DropdownItem>
            {!!currentUser && (
                <AvatarItem user={currentUser} />
            )}
            {!currentUser && (
                <LinkItem
                    to={routes.login(redirect !== '/' ? {
                        redirect,
                    } : {})}
                    underlined
                >
                    <Translate value="general.signIn" />
                </LinkItem>
            )}
            {!currentUser && (
                <LinkItem
                    className={Nav.styles.button}
                    to={routes.signUp()}
                >
                    <Translate value="general.signUp" />
                </LinkItem>
            )}
        </div>
    </nav>
))

Nav.styles = styles

export default Nav
