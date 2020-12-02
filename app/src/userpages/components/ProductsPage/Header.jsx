// @flow

import React, { type Node, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import Tab from '$userpages/components/Header/Tab'
import NameAndUsername from '$userpages/components/Avatar/NameAndUsername'
import ListContainer from '$shared/components/Container/List'
import BackButton from '$shared/components/BackButton'
import UnstyledToolbar from '$shared/components/Toolbar'
import BodyClass from '$shared/components/BodyClass'
import AvatarCircle from '$shared/components/AvatarCircle'
import AvatarImage from '$shared/components/AvatarImage'
import Button from '$shared/components/Button'
import HoverCopy from '$shared/components/HoverCopy'
import useIsMounted from '$shared/hooks/useIsMounted'
import useProduct from '$mp/containers/ProductController/useProduct'
import { productStates } from '$shared/utils/constants'
import { truncate } from '$shared/utils/text'
import routes from '$routes'
import { MD } from '$shared/utils/styled'

const Toolbar = styled(UnstyledToolbar)`
    display: none;

    @media (min-width: ${MD}px) {
        display: block;
    }
`

const ProductInfo = styled.div`
    display: flex;
    margin: 24px 0;

    @media (min-width: ${MD}px) {
        margin: 24px 0 64px 0;
    }
`

const Buttons = styled.div`
    display: none;

    button + button,
    a + button,
    button + a {
        margin-left: 1rem;
    }

    @media (min-width: ${MD}px) {
        display: flex;
        align-items: center;
    }
`

const Avatar = styled.div`
    display: flex;
    flex-grow: 1;

    ${AvatarCircle} {
         margin-right: 1.5rem;
    }

    @media (min-width: ${MD}px) {
        ${AvatarCircle} {
            margin-right: 2.5rem;
        }
    }
`

const TabContainer = styled.div`
    align-items: center;
    display: flex;
    height: calc(3.25 * var(--um));
    justify-content: space-between;
    position: relative;
`

const TabBar = styled.div`
    display: flex;
    line-height: 32px;
    overflow-x: auto;
`

const SearchBar = styled.div`
    display: flex;
    margin-right: 36px;
`

const Tabs = styled.div`
    display: flex;
`

const FilterBar = styled.div`
    /* 36px - height of the dropdown toggle. */
    height: 36px;
    right: 16px;
    display: none;

    @media (min-width: ${MD}px) {
        display: block;
    }
`

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
            />
            <ListContainer className={className}>
                <ProductInfo>
                    <Avatar>
                        <AvatarCircle>
                            <AvatarImage
                                src={imageUrl}
                                username={beneficiaryAddress}
                            />
                        </AvatarCircle>
                        <NameAndUsername name={name}>
                            {!!beneficiaryAddress && (
                                <HoverCopy value={beneficiaryAddress}>
                                    {truncate(beneficiaryAddress, {
                                        maxLength: 20,
                                    })}
                                </HoverCopy>
                            )}
                        </NameAndUsername>
                    </Avatar>
                    <Buttons>
                        <Button
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
                    </Buttons>
                </ProductInfo>
                <TabContainer>
                    <TabBar>
                        <SearchBar>
                            {searchComponent}
                        </SearchBar>
                        <Tabs>
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
                        </Tabs>
                    </TabBar>
                    <FilterBar>
                        {filterComponent}
                    </FilterBar>
                </TabContainer>
            </ListContainer>
        </React.Fragment>
    )
}

export default Header
