// @flow

import React, { type Node, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import cx from 'classnames'

import { selectUserData } from '$shared/modules/user/selectors'
import { userpages } from '$userpages/../links'
import Tab from '$userpages/components/Header/Tab'
import { formatPath } from '$shared/utils/url'
import NameAndEmail from '$userpages/components/Avatar/NameAndEmail'
import AvatarCircle from '$shared/components/AvatarCircle'
import ListContainer from '$shared/components/Container/List'
import BackButton from '$shared/components/BackButton'
import Toolbar from '$shared/components/Toolbar'
import BodyClass from '$shared/components/BodyClass'
import useIsMounted from '$shared/hooks/useIsMounted'

import routes from '$routes'

import avatarStyles from '$userpages/components/Avatar/avatar.pcss'
import styles from './header.pcss'

type Props = {
    className?: string,
    additionalComponent?: Node,
    searchComponent?: Node,
    filterComponent?: Node,
}

const Header = ({ className, additionalComponent, searchComponent, filterComponent }: Props) => {
    const user = useSelector(selectUserData)
    const dispatch = useDispatch()
    const isMounted = useIsMounted()

    const redirectToProductList = useCallback(() => {
        if (!isMounted()) { return }
        dispatch(push(routes.products()))
    }, [
        isMounted,
        dispatch,
    ])

    return (
        <React.Fragment>
            <BodyClass className="core" />
            <Toolbar
                left={<BackButton onBack={redirectToProductList} />}
                altMobileLayout
            />
            <ListContainer className={cx(styles.listTemp, className)}>
                {user &&
                    <div className={styles.profile}>
                        <div className={cx(avatarStyles.container, styles.avatar)}>
                            <AvatarCircle
                                name={user.name}
                                imageUrl={user.imageUrlLarge}
                                className={avatarStyles.avatarCircle}
                                uploadAvatarPlaceholder
                            />
                            <NameAndEmail name={user.name} email={user.username} />
                        </div>
                        <div className={styles.additionalComponent}>
                            {additionalComponent}
                        </div>
                    </div>
                }
                <div className={styles.tabContainer} >
                    <div className={styles.tabBar}>
                        <div className={styles.searchBar}>
                            {searchComponent}
                        </div>
                        <div className={styles.tabs}>
                            <Tab to={formatPath(userpages.streams)}>
                                Overview
                            </Tab>
                            <Tab to={formatPath(userpages.canvases)}>
                                Members
                            </Tab>
                        </div>
                    </div>
                    <div className={styles.filterBar}>
                        {filterComponent}
                    </div>
                </div>
            </ListContainer>
        </React.Fragment>
    )
}

export default Header
