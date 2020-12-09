// @flow

import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { CoreHelmet } from '$shared/components/Helmet'
import Layout from '../Layout'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { getAllDataUnions } from '$mp/modules/dataUnion/actions'
import { selectMyProductList, selectFetching } from '$mp/modules/myProductList/selectors'
import { selectDataUnions, selectFetchingDataUnionStats } from '$mp/modules/dataUnion/selectors'
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

const DataUnionPage = () => {
    const { filter, setSearch, resetFilter } = useFilterSort([])
    const allProducts = useSelector(selectMyProductList)
    const fetchingProducts = useSelector(selectFetching)
    const stats = useSelector(selectDataUnions)
    const fetchingDataUnions = useSelector(selectFetchingDataUnionStats)
    const dispatch = useDispatch()

    console.log(stats)

    useEffect(() => {
        dispatch(getMyProducts(filter))
    }, [dispatch, filter])

    useEffect(() => {
        dispatch(getAllDataUnions())
    }, [dispatch])

    const products = useMemo(() => (
        allProducts.filter((p) => isDataUnionProduct(p))
    ), [allProducts])

    const fetching = useMemo(() => (
        fetchingProducts || fetchingDataUnions
    ), [fetchingProducts, fetchingDataUnions])

    return (
        <Layout
            headerAdditionalComponent={
                <CreateButton
                    tag={Link}
                    to={routes.products.new({
                        type: 'DATAUNION',
                    })}
                >
                    <Translate value="userpages.dataunions.createDataUnion" />
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
            <CoreHelmet title={I18n.t('userpages.title.dataunions')} />
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

export default DataUnionPage
