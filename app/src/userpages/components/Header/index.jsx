// @flow

import React, { type Node } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import type { User } from '$shared/flowtype/user-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { selectUserData } from '$shared/modules/user/selectors'
import Avatar from '$userpages/components/Avatar'
import ListContainer from '$shared/components/Container/List'
import routes from '$routes'
import Tab from './Tab'
import AccountsBalance from './AccountsBalance'
import styles from './header.pcss'

type OwnProps = {
    className?: string,
    additionalComponent?: Node,
    searchComponent?: Node,
    filterComponent?: Node,
    noHeader?: boolean,
}

type StateProps = {
    user: ?User,
}

type Props = StateProps & OwnProps

const Header = ({
    className,
    additionalComponent,
    searchComponent,
    filterComponent,
    user,
    noHeader,
}: Props) => (
    <ListContainer className={cx(styles.listTemp, className)}>
        {!noHeader && user &&
            <div className={styles.profile}>
                <Avatar
                    className={styles.avatar}
                    user={user}
                    linkToProfile
                >
                    <AccountsBalance />
                </Avatar>
                <div className={styles.additionalComponent}>
                    {additionalComponent}
                </div>
            </div>
        }
        {!noHeader && (
            <div className={styles.tabContainer} >
                <div className={styles.tabBar}>
                    <div className={styles.searchBar}>
                        {searchComponent}
                    </div>
                    <div className={styles.tabs}>
                        <Tab to={routes.streams.index()}>
                            <Translate value="general.streams" />
                        </Tab>
                        <Tab to={routes.canvases.index()}>
                            <Translate value="general.canvases" />
                        </Tab>
                        <Tab to={routes.dashboards.index()}>
                            <Translate value="general.dashboards" />
                        </Tab>
                        <Tab to={routes.products.index()}>
                            <Translate value="general.products" />
                        </Tab>
                        <Tab to={routes.subscriptions()}>
                            <Translate value="general.subscriptions" />
                        </Tab>
                        <Tab to={routes.transactions()}>
                            <Translate value="general.transactions" />
                        </Tab>
                    </div>
                </div>
                <div className={styles.filterBar}>
                    {filterComponent}
                </div>
            </div>
        )}
    </ListContainer>
)

Header.defaultProps = {
    noHeader: false,
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    user: selectUserData(state),
})

export default connect(mapStateToProps)(Header)
