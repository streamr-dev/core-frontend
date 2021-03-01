// @flow

import React, { type Node } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'

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
                            Streams
                        </Tab>
                        <Tab to={routes.canvases.index()}>
                            Canvases
                        </Tab>
                        <Tab to={routes.dashboards.index()}>
                            Dashboards
                        </Tab>
                        <Tab to={routes.products.index()}>
                            Products
                        </Tab>
                        <Tab to={routes.subscriptions()}>
                            Subscriptions
                        </Tab>
                        <Tab to={routes.transactions()}>
                            Transactions
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
