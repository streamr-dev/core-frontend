// @flow

import React, { type Node, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import cx from 'classnames'

import Tab from '$userpages/components/Header/Tab'
import NameAndEmail from '$userpages/components/Avatar/NameAndEmail'
import ListContainer from '$shared/components/Container/List'
import BackButton from '$shared/components/BackButton'
import Toolbar from '$shared/components/Toolbar'
import BodyClass from '$shared/components/BodyClass'
import FallbackImage from '$shared/components/FallbackImage'
import Button from '$shared/components/Button'
import useIsMounted from '$shared/hooks/useIsMounted'
import useProduct from '$mp/containers/ProductController/useProduct'
import { productStates } from '$shared/utils/constants'

import routes from '$routes'

import avatarStyles from '$userpages/components/Avatar/avatar.pcss'
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
                        <FallbackImage
                            className={cx(avatarCircleStyles.accountCircle, avatarStyles.avatarCircle)}
                            src={product.imageUrl || ''}
                            alt={product.name || ''}
                        />
                        <NameAndEmail name={product.name} email={product.beneficiaryAddress} />
                    </div>
                    <div className={styles.additionalComponent}>
                        <Button
                            className={styles.viewProductButton}
                            outline
                            {...(product.state === productStates.DEPLOYED ? {
                                tag: Link,
                                to: routes.product({
                                    id: product.id,
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
                            tag={Link}
                            outline
                            to={routes.editProduct({
                                id: product.id,
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
                                to={routes.productStats({
                                    id: product.id,
                                })}
                            >
                                Overview
                            </Tab>
                            <Tab
                                to={routes.productMembers({
                                    id: product.id,
                                })}
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
