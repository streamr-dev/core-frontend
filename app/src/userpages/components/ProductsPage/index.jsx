// @flow

import React, { useEffect, useMemo, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CoreHelmet } from '$shared/components/Helmet'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFetching } from '$mp/modules/myProductList/selectors'
import { productStates } from '$shared/utils/constants'
import Popover from '$shared/components/Popover'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import { isDataUnionProduct } from '$mp/utils/product'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useModal from '$shared/hooks/useModal'
import useAllDataUnionStats from '$mp/modules/dataUnion/hooks/useAllDataUnionStats'
import CreateProductModal from '$mp/containers/CreateProductModal'
import Button from '$shared/components/Button'
import Grid from '$shared/components/Tile/Grid'
import { ProductTile } from '$shared/components/Tile'
import Search from '../Header/Search'
import { getFilters } from '../../utils/constants'
import Layout from '../Layout'
import NoProductsView from './NoProducts'
import * as MenuItems from './MenuItems'

import styles from './products.pcss'

export const CreateProductButton = () => {
    const { api: createProductDialog } = useModal('marketplace.createProduct')

    return (
        <Button
            type="button"
            className={styles.createProductButton}
            onClick={() => createProductDialog.open()}
        >
            Create
        </Button>
    )
}

const ProductsPage = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters('product')
        return [
            filters.RECENT_DESC,
            filters.NAME_ASC,
            filters.NAME_DESC,
            filters.PUBLISHED,
            filters.DRAFTS,
        ]
    }, [])
    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(sortOptions)
    const allProducts = useSelector(selectMyProductList)
    const fetching = useSelector(selectFetching)
    const dispatch = useDispatch()
    const {
        load: loadDataUnionStats,
        members,
        loadedIds,
        fetchingIds,
        reset: resetStats,
    } = useAllDataUnionStats()

    useEffect(() => {
        dispatch(getMyProducts(filter))
            .then(loadDataUnionStats)
    }, [dispatch, filter, loadDataUnionStats])

    useEffect(() => () => {
        resetStats()
    }, [resetStats])

    const products = useMemo(() => (
        // allProducts.filter((p) => !isDataUnionProduct(p))
        allProducts
    ), [allProducts])

    return (
        <Layout
            headerAdditionalComponent={<CreateProductButton />}
            headerSearchComponent={
                <Search.Active
                    placeholder="Filter products"
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                />
            }
            headerFilterComponent={
                <Popover
                    title="Sort by"
                    type="uppercase"
                    caret="svg"
                    activeTitle
                    onChange={setSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                    menuProps={{
                        right: true,
                    }}
                >
                    {sortOptions.map((s) => (
                        <Popover.Item key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </Popover.Item>
                    ))}
                </Popover>
            }
            loading={fetching}
        >
            <CoreHelmet title="Products" />
            <ListContainer className={styles.corepageContentContainer}>
                {!fetching && products && !products.length && (
                    <NoProductsView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                <Grid>
                    {products.map((product) => {
                        const { id, beneficiaryAddress: originalBeneficiaryAddress, state, type } = product
                        const isDataUnion = isDataUnionProduct(type)
                        const beneficiaryAddress = (originalBeneficiaryAddress || '').toLowerCase()
                        const readyToFetch = loadedIds.includes(beneficiaryAddress)
                        const isFetching = fetchingIds.includes(beneficiaryAddress)
                        const memberCount = (isDataUnion && !isFetching) ? members[beneficiaryAddress] : undefined
                        const isDeploying = isDataUnion && readyToFetch && !isFetching && typeof memberCount === 'undefined'
                        const contractAddress = isDataUnion ? beneficiaryAddress : null
                        const published = state === productStates.DEPLOYED
                        const deployed = !!(isDataUnion && !!beneficiaryAddress)

                        return (
                            <ProductTile
                                key={id}
                                actions={
                                    <Fragment>
                                        <MenuItems.Edit id={id} />
                                        <MenuItems.View id={id} disabled={!published} />
                                        {deployed && (
                                            <MenuItems.ViewStats id={id} />
                                        )}
                                        {deployed && (
                                            <MenuItems.ViewDataUnion id={id} />
                                        )}
                                        {contractAddress && (
                                            <MenuItems.CopyContractAddress address={contractAddress} />
                                        )}
                                        <MenuItems.Copy id={id} disabled={!published} />
                                    </Fragment>
                                }
                                published={published}
                                deployed={deployed}
                                numMembers={memberCount}
                                product={product}
                                showDataUnionBadge={isDataUnion}
                                showDeployingBadge={isDeploying}
                            />
                        )
                    })}
                </Grid>
            </ListContainer>
            <DocsShortcuts />
            <CreateProductModal />
        </Layout>
    )
}

export default ProductsPage
