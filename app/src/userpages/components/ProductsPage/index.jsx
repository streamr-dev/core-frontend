// @flow

import React, { useEffect, useMemo, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import Helmet from 'react-helmet'

import Layout from '../Layout'
import { getFilters } from '../../utils/constants'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFetching } from '$mp/modules/myProductList/selectors'
import { productStates } from '$shared/utils/constants'
import Search from '../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import NoProductsView from './NoProducts'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import { isDataUnionProduct } from '$mp/utils/product'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useModal from '$shared/hooks/useModal'
import useMemberStats from '$mp/modules/dataUnion/hooks/useMemberStats'
import CreateProductModal from '$mp/containers/CreateProductModal'
import Button from '$shared/components/Button'
import Grid from '$shared/components/Tile/Grid'
import { ProductTile } from '$shared/components/Tile'
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
            <Translate value="userpages.products.createProduct" />
        </Button>
    )
}

const ProductsPage = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters('product')
        return [
            filters.RECENT,
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
    const products = useSelector(selectMyProductList)
    const fetching = useSelector(selectFetching)
    const dispatch = useDispatch()
    const { load: loadDataUnionStats, members, fetching: fetchingDataUnionStats } = useMemberStats()

    useEffect(() => {
        dispatch(getMyProducts(filter))
    }, [dispatch, filter])

    useEffect(() => {
        loadDataUnionStats()
    }, [loadDataUnionStats])

    return (
        <Layout
            headerAdditionalComponent={<CreateProductButton />}
            headerSearchComponent={
                <Search
                    placeholder={I18n.t('userpages.products.filterProducts')}
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                />
            }
            headerFilterComponent={
                <Dropdown
                    title={I18n.t('userpages.filter.sortBy')}
                    onChange={setSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                >
                    {sortOptions.map((s) => (
                        <Dropdown.Item key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            }
            loading={fetching}
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.products')}`} />
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
                        const { id, beneficiaryAddress, state } = product
                        const isDataUnion = isDataUnionProduct(product.type)
                        const memberCount = isDataUnion ? members[(beneficiaryAddress || '').toLowerCase()] : undefined
                        const isDeploying = isDataUnion && !fetchingDataUnionStats && !!beneficiaryAddress && typeof memberCount === 'undefined'
                        const contractAddress = isDataUnion ? beneficiaryAddress : null
                        const deployed = state === productStates.DEPLOYED

                        return (
                            <ProductTile
                                key={id}
                                actions={
                                    <Fragment>
                                        <MenuItems.Edit id={id} />
                                        <MenuItems.View id={id} disabled={!deployed} />
                                        {isDataUnion && !!beneficiaryAddress && (
                                            <MenuItems.ViewStats id={id} />
                                        )}
                                        {isDataUnion && !!beneficiaryAddress && (
                                            <MenuItems.ViewDataUnion id={id} />
                                        )}
                                        {contractAddress && (
                                            <MenuItems.CopyContractAddress address={contractAddress} />
                                        )}
                                        <MenuItems.Copy id={id} disabled={!deployed} />
                                    </Fragment>
                                }
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
