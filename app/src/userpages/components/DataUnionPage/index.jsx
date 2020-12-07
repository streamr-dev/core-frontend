// @flow

import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { CoreHelmet } from '$shared/components/Helmet'
import Layout from '../Layout'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFetching } from '$mp/modules/myProductList/selectors'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import { isDataUnionProduct } from '$mp/utils/product'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useModal from '$shared/hooks/useModal'
import useMemberStats from '$mp/modules/dataUnion/hooks/useMemberStats'
import Button from '$shared/components/Button'
import { MD, LG } from '$shared/utils/styled'
import routes from '$routes'

import Search from '../Header/Search'
import NoDataUnionsView from './NoDataUnions'
import Item from './Item'

const CreateButton = styled(Button)`
    display: none;
    min-width: 6rem;

    @media (min-width: ${LG}px) {
        display: block;
    }
`

const StyledListContainer = styled(ListContainer)`
    && {
        margin-top: 16px;
    }

    @media (min-width: ${MD}px) {
        && {
            margin-top: 34px;
        }
    }

    @media (min-width: ${LG}px) {
        && {
            margin-top: 0;
        }
    }
`

const ProductsPage = () => {
    const { filter, setSearch, resetFilter } = useFilterSort([])
    const allProducts = useSelector(selectMyProductList)
    const fetching = useSelector(selectFetching)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getMyProducts(filter))
    }, [dispatch, filter])

    const products = useMemo(() => (
        allProducts.filter((p) => isDataUnionProduct(p))
    ), [allProducts])

    return (
        <Layout
            headerAdditionalComponent={
                <CreateButton
                    tag={Link}
                    to={routes.products.new({
                        type: 'DATAUNION',
                    })}
                >
                    <Translate value="userpages.products.createProduct" />
                </CreateButton>
            }
            headerSearchComponent={
                <Search
                    placeholder={I18n.t('userpages.products.filterProducts')}
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                />
            }
            loading={fetching}
        >
            <CoreHelmet title={I18n.t('userpages.title.products')} />
            <StyledListContainer>
                {!fetching && products && !products.length && (
                    <NoDataUnionsView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {products.map((product) => (
                    <Item
                        key={product.id}
                        product={product}
                    />
                ))}
            </StyledListContainer>
            <DocsShortcuts />
        </Layout>
    )
}

export default ProductsPage
