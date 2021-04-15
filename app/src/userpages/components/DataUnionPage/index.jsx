// @flow

import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { CoreHelmet } from '$shared/components/Helmet'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFetching } from '$mp/modules/myProductList/selectors'
import useAllDataUnionStats from '$mp/modules/dataUnion/hooks/useAllDataUnionStats'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import useFilterSort from '$userpages/hooks/useFilterSort'
import Button from '$shared/components/Button'
import { MD, LG } from '$shared/utils/styled'
import { getFilters } from '$userpages/utils/constants'
import PublishModal from '$mp/containers/EditProductPage/PublishModal'
import { Provider as PendingProvider } from '$shared/contexts/Pending'
import routes from '$routes'

import Search from '../Header/Search'
import Layout from '../Layout'
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
    const sortOptions = useMemo(() => {
        const filters = getFilters('product')
        return [
            filters.RECENT_DESC,
        ]
    }, [])
    const { filter, setSearch, resetFilter } = useFilterSort(sortOptions)
    const products = useSelector(selectMyProductList)
    const fetching = useSelector(selectFetching)
    const dispatch = useDispatch()

    const { load: loadDataUnionStats, stats } = useAllDataUnionStats()

    useEffect(() => {
        // Modify filter to include only dataunions
        const finalFilter = {
            ...filter,
            key: 'type',
            value: 'dataunion',
        }
        dispatch(getMyProducts(finalFilter)).then((results) => {
            loadDataUnionStats(results)
        })
    }, [dispatch, filter, loadDataUnionStats])

    return (
        <Layout
            headerAdditionalComponent={
                <CreateButton
                    tag={Link}
                    to={routes.products.new({
                        type: 'DATAUNION',
                    })}
                >
                    Create Data Union
                </CreateButton>
            }
            headerSearchComponent={
                <Search.Active
                    placeholder="Filter products"
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                />
            }
            loading={fetching}
        >
            <CoreHelmet title="Data Unions" />
            <StyledListContainer>
                {!fetching && products && !products.length && (
                    <NoDataUnionsView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {products.map((product) => {
                    const duStats = stats.find((s) =>
                        s.id && product.beneficiaryAddress &&
                        s.id.toLowerCase() === product.beneficiaryAddress.toLowerCase())

                    return (
                        <Item
                            key={product.id}
                            product={product}
                            stats={duStats}
                        />
                    )
                })}
            </StyledListContainer>
            <DocsShortcuts />
            <PublishModal />
        </Layout>
    )
}

export default () => (
    <PendingProvider name="dataunion">
        <DataUnionPage />
    </PendingProvider>
)
