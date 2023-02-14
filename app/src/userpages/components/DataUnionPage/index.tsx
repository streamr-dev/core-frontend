import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { CoreHelmet } from '$shared/components/Helmet'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFetching } from '$mp/modules/myProductList/selectors'
import useAllDataUnionStats from '$mp/modules/dataUnion/hooks/useAllDataUnionStats'
import { getDataUnionsOwnedBy } from '$mp/modules/dataUnion/services'
import { projectTypes } from '$mp/utils/constants'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import useFilterSort from '$userpages/hooks/useFilterSort'
import Button from '$shared/components/Button'
import { MD, LG } from '$shared/utils/styled'
import { getFilters } from '$userpages/utils/constants'
import PublishModal from '$mp/containers/EditProductPage/PublishModal'
import DeployDataUnionModal from '$mp/containers/EditProductPage/DeployDataUnionModal'
import { Provider as PendingProvider } from '$shared/contexts/Pending'
import { getApiStringFromChainId } from '$shared/utils/chains'
import { ProjectIdList } from '$mp/types/project-types'
import { projectStates } from '$shared/utils/constants'
import {useAuthController} from "$auth/hooks/useAuthController"
import routes from '$routes'
import Search from '../Header/Search'
import Layout from '../Layout'
import NoDataUnionsView from './NoDataUnions'
import Item from './Item'

const CreateButton = styled(Button)`
    && {
        display: none;
        min-width: 6rem;
    }

    @media (min-width: ${LG}px) {
        && {
            display: inline-flex;
        }
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

const DataUnionPage: FunctionComponent = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters('product')
        return [filters.RECENT_DESC]
    }, [])
    const [dataUnionsFromTheGraph, setDataUnionsFromTheGraph ] = useState([])
    const { filter, setSearch, resetFilter } = useFilterSort(sortOptions)
    const allProducts = useSelector(selectMyProductList)
    const fetching = useSelector(selectFetching)
    const dispatch = useDispatch()
    const { load: loadDataUnionStats, stats } = useAllDataUnionStats()
    const {currentAuthSession} = useAuthController()

    // Make sure we show only data unions.
    // This is needed to avoid quick flash of possibly normal products.
    const products = useMemo(() => allProducts.filter((p) => p.type === projectTypes.DATAUNION), [allProducts])

    useEffect(() => {
        // Modify filter to include only dataunions
        const finalFilter = {
            ...filter,
            key: 'type',
            value: projectTypes.DATAUNION,
        }

        const load = async () => {
            // Load DUs from API
            const results = await dispatch(getMyProducts(finalFilter)) as unknown as ProjectIdList
            loadDataUnionStats(results)

            if (!!currentAuthSession.address) {
                // Load DUs from The Graph so that we can show "detached" DUs that have no corresponding product in the API
                const ownedDus = await getDataUnionsOwnedBy(currentAuthSession.address)

                setDataUnionsFromTheGraph((prev) => ([
                    ...prev,
                    ...ownedDus.map((du) => ({
                        ...du,
                        chain: getApiStringFromChainId(du.chainId),
                        state: projectStates.DETACHED,
                        updated: Number.parseInt(du.creationDate || '0') * 1000,
                        beneficiaryAddress: du.id,
                    }))
                ]))
            }
        }

        load()
    }, [dispatch, filter, loadDataUnionStats, currentAuthSession])

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
                {!fetching && (products && products.length === 0) && (dataUnionsFromTheGraph && dataUnionsFromTheGraph.length === 0) && (
                    <NoDataUnionsView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {products != null && products.length > 0 && products.map((product) => {
                    const duStats = stats.find(
                        (s) =>
                            s.id &&
                            product.beneficiaryAddress &&
                            s.id.toLowerCase() === product.beneficiaryAddress.toLowerCase(),
                    )
                    return <Item key={product.id} product={product} stats={duStats} />
                })}
                {
                    dataUnionsFromTheGraph != null &&
                    dataUnionsFromTheGraph.length > 0 &&
                    dataUnionsFromTheGraph
                        // Prioritize products from API
                        .filter((du) => !products.map((p) => p && p.beneficiaryAddress && p.beneficiaryAddress.toLowerCase()).includes(du.id))
                        .map((du) =>
                        {
                            const duStats = {
                                totalEarnings: du.revenueWei,
                                memberCount: {
                                    total: du.memberCount,
                                },
                            }
                            return <Item key={du.id} product={du} stats={duStats} />
                        })
                }
            </StyledListContainer>
            <DocsShortcuts />
            <PublishModal />
            <DeployDataUnionModal />
        </Layout>
    )
}

const DataUnionPageWrap: FunctionComponent = () => (
    <PendingProvider name="dataunion">
        <DataUnionPage />
    </PendingProvider>
)

export default DataUnionPageWrap
