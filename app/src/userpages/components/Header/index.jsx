// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push, getLocation } from 'react-router-redux'
import type { Location } from 'react-router-dom'
import classNames from 'classnames'
import { Container } from 'reactstrap'

import type { User } from '$shared/flowtype/user-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { selectUserData } from '$shared/modules/user/selectors'
import Tabs from '$shared/components/Tabs'
import { userpages } from '../../../links'
import { formatPath } from '$shared/utils/url'

import styles from './header.pcss'

type OwnProps = {
    className?: string,
}

type StateProps = {
    user: ?User,
    location: Location,
}

type DispatchProps = {
    navigate: (string) => void,
}

type Props = StateProps & DispatchProps & OwnProps

const Header = ({ className, user, navigate, location }: Props) => (
    <Container className={classNames(className)}>
        {user &&
            <div className={styles.profile}>
                <img className={styles.avatar} src="https://www.streamr.com/assets/TeamPhotos/Matt.jpg" alt="avatar" />
                <div>
                    <div className={styles.fullName}>{user.name}</div>
                    <div className={styles.userName}>{user.username}</div>
                </div>
            </div>
        }
        <div className={styles.tabBar}>
            <Tabs location={location} navigate={navigate}>
                <Tabs.Tab title="Canvases" link={formatPath(userpages.canvases)} />
                <Tabs.Tab title="Streams" link={formatPath(userpages.streams)} />
                <Tabs.Tab title="Dashboards" link={formatPath(userpages.dashboards)} />
                <Tabs.Tab title="Products" link={formatPath(userpages.products)} />
                <Tabs.Tab title="Purchases" link={formatPath(userpages.purchases)} />
                <Tabs.Tab title="Transactions" link={formatPath(userpages.transactions)} />
            </Tabs>
        </div>
    </Container>
)

export const mapStateToProps = (state: StoreState): StateProps => ({
    user: selectUserData(state),
    location: getLocation(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    navigate: (to: string) => dispatch(push(to)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
