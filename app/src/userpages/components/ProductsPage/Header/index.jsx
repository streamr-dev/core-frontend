// @flow

import React, { type Node, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import cx from 'classnames'

import Tab from '$userpages/components/Header/Tab'
import NameAndUsername from '$userpages/components/Avatar/NameAndUsername'
import ListContainer from '$shared/components/Container/List'
import BackButton from '$shared/components/BackButton'
import Toolbar from '$shared/components/Toolbar'
import BodyClass from '$shared/components/BodyClass'
import FallbackImage from '$shared/components/FallbackImage'
import Button from '$shared/components/Button'
import HoverCopy from '$shared/components/HoverCopy'
import useIsMounted from '$shared/hooks/useIsMounted'
import useProduct from '$mp/containers/ProductController/useProduct'
import { productStates } from '$shared/utils/constants'
import { truncate } from '$shared/utils/text'
import routes from '$routes'

import avatarCircleStyles from '$shared/components/AvatarCircle/avatarCircle.pcss'
import styles from './header.pcss'

type Props = {
    className?: string,
    searchComponent?: Node,
    filterComponent?: Node,
}

const Header = ({ className, searchComponent, filterComponent }: Props) => {
    const dispatch = useDispatch()
    const isMounted = useIsMounted()
    const product = useProduct()

    const redirectToProductList = useCallback(() => {
        if (!isMounted()) { return }
        dispatch(push(routes.products.index()))
    }, [
        isMounted,
        dispatch,
    ])

    const {
        id,
        imageUrl,
        name,
        beneficiaryAddress,
        state,
    } = product || {}

    return (
        <React.Fragment>
            <BodyClass className="core" />
            <Toolbar
                left={<BackButton onBack={redirectToProductList} />}
                altMobileLayout
                className={styles.toolbar}
            />
            <ListContainer className={cx(styles.listTemp, className)}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        {!imageUrl ? (
                            <div className={styles.avatarCircle} />
                        ) : (
                            <FallbackImage
                                className={cx(avatarCircleStyles.accountCircle, styles.avatarCircle)}
                                src={imageUrl || ''}
                                alt={name || ''}
                            />
                        )}
                        <NameAndUsername name={name}>
                            {!!beneficiaryAddress && (
                                <HoverCopy value={beneficiaryAddress}>
                                    {truncate(beneficiaryAddress, {
                                        maxLength: 20,
                                    })}
                                </HoverCopy>
                            )}
                        </NameAndUsername>
                    </div>
                    <div className={styles.additionalComponent}>
                        <Button
                            className={styles.viewProductButton}
                            outline
                            {...(state === productStates.DEPLOYED ? {
                                tag: Link,
                                to: routes.marketplace.product({
                                    id,
                                }),
                            } : {
                                type: 'button',
                                onClick: () => {},
                                disabled: true,
                            })}
                        >
                            <Translate value="userpages.products.viewProduct" />
                        </Button>
                        <Button
                            className={styles.editProductButton}
                            outline
                            {...(id ? {
                                tag: Link,
                                to: routes.products.edit({
                                    id,
                                }),
                            } : {
                                type: 'button',
                                onClick: () => {},
                                disabled: true,
                            })}
                        >
                            <Translate value="userpages.products.settings" />
                        </Button>
                    </div>
                </div>
                <div className={styles.tabContainer} >
                    <div className={styles.tabBar}>
                        <div className={styles.searchBar}>
                            {searchComponent}
                        </div>
                        <div className={styles.tabs}>
                            <Tab
                                to={id ? routes.products.stats({
                                    id,
                                }) : ''}
                            >
                                Overview
                            </Tab>
                            <Tab
                                to={id ? routes.products.members({
                                    id,
                                }) : ''}
                            >
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
