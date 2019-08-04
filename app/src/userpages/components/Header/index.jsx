// @flow

import React, { type Node } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import type { User } from '$shared/flowtype/user-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { selectUserData } from '$shared/modules/user/selectors'
import { userpages } from '../../../links'
import Tab from './Tab'
import { formatPath } from '$shared/utils/url'
import Avatar from '$userpages/components/Avatar'
import ListContainer from '$shared/components/Container/List'
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
                />
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
                        <Tab to={formatPath(userpages.streams)}>
                            <Translate value="userpages.header.streams" />
                        </Tab>
                        <Tab to={formatPath(userpages.canvases)}>
                            <Translate value="userpages.header.canvases" />
                        </Tab>
                        <Tab to={formatPath(userpages.dashboards)}>
                            <Translate value="userpages.header.dashboards" />
                        </Tab>
                        <Tab to={formatPath(userpages.products)}>
                            <Translate value="userpages.header.products" />
                        </Tab>
                        <Tab to={formatPath(userpages.purchases)}>
                            <Translate value="userpages.header.purchases" />
                        </Tab>
                        <Tab to={formatPath(userpages.transactions)}>
                            <Translate value="userpages.header.transactions" />
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
