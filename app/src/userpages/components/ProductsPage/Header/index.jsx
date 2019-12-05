// @flow

import React, { type Node, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import cx from 'classnames'

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
import useProduct from '$mp/containers/ProductController/useProduct'

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
    const dispatch = useDispatch()
    const isMounted = useIsMounted()
    const product = useProduct()

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
                <div className={styles.profile}>
                    <div className={cx(avatarStyles.container, styles.avatar)}>
                        <AvatarCircle
                            name={product.name}
                            imageUrl={product.imageUrl}
                            className={avatarStyles.avatarCircle}
                            uploadAvatarPlaceholder
                        />
                        <NameAndEmail name={product.name} email={product.beneficiaryAddress} />
                    </div>
                    <div className={styles.additionalComponent}>
                        {additionalComponent}
                    </div>
                </div>
                <div className={styles.tabContainer} >
                    <div className={styles.tabBar}>
                        <div className={styles.searchBar}>
                            {searchComponent}
                        </div>
                        <div className={styles.tabs}>
                            <Tab
                                to={routes.productStats({
                                    id: product.id,
                                })}
                            >
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
