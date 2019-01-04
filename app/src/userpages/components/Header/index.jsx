// @flow

import React, { type Node } from 'react'
import { connect } from 'react-redux'
import { push, getLocation } from 'react-router-redux'
import type { Location } from 'react-router-dom'
import classNames from 'classnames'
import { Container } from 'reactstrap'
import { I18n } from 'react-redux-i18n'

import type { User } from '$shared/flowtype/user-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { selectUserData } from '$shared/modules/user/selectors'
import Tabs from '$shared/components/Tabs'
import { userpages } from '../../../links'
import { formatPath } from '$shared/utils/url'
import Avatar from '$userpages/components/Avatar'

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
    location: Location,
}

type DispatchProps = {
    navigate: (string) => void,
}

type Props = StateProps & DispatchProps & OwnProps

const Header = ({
    className,
    additionalComponent,
    searchComponent,
    filterComponent,
    user,
    navigate,
    location,
    noHeader,
}: Props) => (
    <Container className={classNames(className)}>
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
            <div className={styles.tabBar}>
                <div className={styles.searchBar}>
                    {searchComponent}
                </div>
                <Tabs location={location} navigate={navigate}>
                    <Tabs.Tab title={I18n.t('userpages.header.canvases')} link={formatPath(userpages.canvases)} />
                    <Tabs.Tab title={I18n.t('userpages.header.streams')} link={formatPath(userpages.streams)} />
                    <Tabs.Tab title={I18n.t('userpages.header.dashboards')} link={formatPath(userpages.dashboards)} />
                    <Tabs.Tab title={I18n.t('userpages.header.products')} link={formatPath(userpages.products)} />
                    <Tabs.Tab title={I18n.t('userpages.header.purchases')} link={formatPath(userpages.purchases)} />
                    <Tabs.Tab title={I18n.t('userpages.header.transactions')} link={formatPath(userpages.transactions)} />
                </Tabs>
                <div className={styles.filterBar}>
                    {filterComponent}
                </div>
            </div>
        )}
    </Container>
)

Header.defaultProps = {
    noHeader: false,
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    user: selectUserData(state),
    location: getLocation(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    navigate: (to: string) => dispatch(push(to)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
