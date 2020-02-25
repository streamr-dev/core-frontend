// @flow

import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'

import Layout from '../Layout'
import links from '../../../links'
import { getFilters } from '../../utils/constants'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFetching } from '$mp/modules/myProductList/selectors'
import { productStates } from '$shared/utils/constants'
import Search from '../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import { formatPath } from '$shared/utils/url'
import NoProductsView from './NoProducts'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import { isDataUnionProduct } from '$mp/utils/product'
import type { ProductId } from '$mp/flowtype/product-types'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useModal from '$shared/hooks/useModal'
import useMemberStats from '$mp/modules/dataUnion/hooks/useMemberStats'
import routes from '$routes'
import CreateProductModal from '$mp/containers/CreateProductModal'
import Button from '$shared/components/Button'
import { productTypes } from '$mp/utils/constants'
import Grid from '$shared/components/Tile2/Grid'
import Tile2 from '$shared/components/Tile2'
import Menu from '$shared/components/Tile2/Menu'
import Label from '$shared/components/Tile2/Label'
import { DataUnionBadge, IconBadge, DeployingBadge } from '$shared/components/Tile2/Badge'
import Summary from '$shared/components/Tile2/Summary'
import ImageContainer from '$shared/components/Tile2/ImageContainer'
import * as MenuItems from './MenuItems'

import styles from './products.pcss'

const CreateProductButton = () => {
    const { api: createProductDialog } = useModal('marketplace.createProduct')

    if (!process.env.NEW_MP_CONTRACT) {
        return (
            <Button
                tag={Link}
                to={links.marketplace.createProduct}
                className={styles.createProductButton}
            >
                <Translate value="userpages.products.createProduct" />
            </Button>
        )
    } else if (process.env.DATA_UNIONS) {
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

    return (
        <Button
            tag={Link}
            className={styles.createProductButton}
            to={routes.newProduct({
                type: productTypes.NORMAL,
            })}
        >
            <Translate value="userpages.products.createProduct" />
        </Button>
    )
}

const getProductLink = (id: ProductId) => {
    if (process.env.NEW_MP_CONTRACT) {
        return formatPath(links.userpages.products, id, 'edit')
    }

    return formatPath(links.marketplace.products, id)
}

const Tiles = ({ products, members, fetchingDataUnionStats }: any) => (
    <Grid>
        {products.map((product) => {
            const {
                id,
                beneficiaryAddress,
                updated,
                created,
                state,
            } = product
            const isDataUnion = isDataUnionProduct(product.type)
            const memberCount = isDataUnion ? members[(beneficiaryAddress || '').toLowerCase()] : undefined
            const updatedAgo = updated && moment(new Date(updated)).fromNow()
            const isDeploying = !fetchingDataUnionStats && typeof memberCount !== 'undefined'

            return (
                <Tile2 key={product.id}>
                    <Menu>
                        <MenuItems.Edit
                            id={id}
                        />
                        <MenuItems.PublishUnpublish
                            id={id}
                            state={state}
                        />
                        <MenuItems.View
                            id={id}
                            disabled={state !== productStates.DEPLOYED}
                        />
                        <MenuItems.ViewStats
                            id={id}
                            isDataUnion={isDataUnion}
                        />
                        <MenuItems.ViewDataUnion
                            id={id}
                            isDataUnion={isDataUnion}
                        />
                        <MenuItems.Copy
                            id={id}
                            disabled={state !== productStates.DEPLOYED}
                        />
                    </Menu>
                    <Link to={id && getProductLink(id)}>
                        <ImageContainer src={product.imageUrl}>
                            {isDataUnion && (
                                <DataUnionBadge top left />
                            )}
                            {typeof memberCount !== 'undefined' && !isDeploying && (
                                <IconBadge bottom right icon="dataUnion">
                                    {memberCount}
                                </IconBadge>
                            )}
                            {isDeploying && (
                                <DeployingBadge bottom right />
                            )}
                        </ImageContainer>
                        <Summary
                            name={product.name}
                            updatedAt={`${updated === created ? 'Created' : 'Updated'} ${updatedAgo}`}
                            label={(
                                <Label positive={product.state === productStates.DEPLOYED}>
                                    {(
                                        product.state === productStates.DEPLOYED ? (
                                            <Translate value="userpages.products.published" />
                                        ) : (
                                            <Translate value="userpages.products.draft" />
                                        )
                                    )}
                                </Label>
                            )}
                        />
                    </Link>
                </Tile2>
            )
        })}
    </Grid>
)

const ProductsPage = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters()
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
                <Tiles
                    products={products}
                    members={members}
                    fetchingDataUnionStats={fetchingDataUnionStats}
                />
            </ListContainer>
            <DocsShortcuts />
            <CreateProductModal />
        </Layout>
    )
}

export default ProductsPage
