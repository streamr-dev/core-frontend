// @flow

import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import Helmet from 'react-helmet'
import moment from 'moment'

import Layout from '../Layout'
import links from '../../../links'
import { getFilters } from '../../utils/constants'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFetching } from '$mp/modules/myProductList/selectors'
import { productStates } from '$shared/utils/constants'
import Tile from '$shared/components/Tile'
import Search from '../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import { formatPath, formatExternalUrl } from '$shared/utils/url'
import DropdownActions from '$shared/components/DropdownActions'
import NoProductsView from './NoProducts'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import TileGrid from '$shared/components/TileGrid'
import { isCommunityProduct } from '$mp/utils/product'
import { getAllCommunityStats } from '$mp/modules/communityProduct/actions'
import { selectCommunityProducts, selectFetchingCommunityStats } from '$mp/modules/communityProduct/selectors'
import type { ProductId, Product } from '$mp/flowtype/product-types'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useCopy from '$shared/hooks/useCopy'
import useModal from '$shared/hooks/useModal'
import routes from '$routes'

import CreateProductModal from '$mp/containers/CreateProductModal'

import styles from './products.pcss'

const CreateProductButton = () => {
    const { api: createProductDialog } = useModal('marketplace.createProduct')

    if (!process.env.COMMUNITY_PRODUCTS) {
        return (
            <Button
                tag={Link}
                to={links.marketplace.createProduct}
            >
                <Translate value="userpages.products.createProduct" />
            </Button>
        )
    }

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

const generateTimeAgoDescription = (productUpdatedDate: Date) => moment(productUpdatedDate).fromNow()

const getProductLink = (id: ProductId) => {
    if (process.env.COMMUNITY_PRODUCTS) {
        return formatPath(links.userpages.products, id, 'edit')
    }

    return formatPath(links.marketplace.products, id)
}

const Actions = (product: Product) => {
    const { id, state } = product
    const isCommunity = isCommunityProduct(product)
    const { copy } = useCopy()
    const dispatch = useDispatch()

    const redirectToEditProduct = useCallback((id: ProductId) => (
        dispatch(push(routes.editProduct({
            id,
        })))
    ), [dispatch])
    const redirectToProductStats = useCallback((id: ProductId) => (
        dispatch(push(routes.productStats({
            id,
        })))
    ), [dispatch])
    const redirectToProductMembers = useCallback((id: ProductId) => (
        dispatch(push(routes.productMembers({
            id,
        })))
    ), [dispatch])
    const redirectToPublishProduct = useCallback((id: ProductId) => (
        dispatch(push(formatPath(links.marketplace.products, id, 'publish')))
    ), [dispatch])
    const redirectToProduct = useCallback((id: ProductId) => (
        dispatch(push(formatPath(links.marketplace.products, id)))
    ), [dispatch])
    const copyUrl = useCallback((id: ProductId) => copy(formatExternalUrl(
        process.env.PLATFORM_ORIGIN_URL,
        links.marketplace.products,
        id,
    )), [copy])

    return (
        <Fragment>
            <DropdownActions.Item
                className={styles.item}
                onClick={() => redirectToEditProduct(id || '')}
            >
                <Translate value="actionsDropdown.edit" />
            </DropdownActions.Item>
            {!process.env.COMMUNITY_PRODUCTS && (state === productStates.DEPLOYED || state === productStates.NOT_DEPLOYED) &&
                <DropdownActions.Item
                    className={styles.item}
                    onClick={() => redirectToPublishProduct(id || '')}
                >
                    {(state === productStates.DEPLOYED) ?
                        <Translate value="actionsDropdown.unpublish" /> :
                        <Translate value="actionsDropdown.publish" />
                    }
                </DropdownActions.Item>
            }
            {!!process.env.COMMUNITY_PRODUCTS &&
                <DropdownActions.Item
                    className={styles.item}
                    onClick={() => (!!redirectToProduct && redirectToProduct(id || ''))}
                    disabled={state !== productStates.DEPLOYED}
                >
                    <Translate value="actionsDropdown.viewProduct" />
                </DropdownActions.Item>
            }
            {!!process.env.COMMUNITY_PRODUCTS && isCommunity &&
                <DropdownActions.Item
                    className={styles.item}
                    onClick={() => (!!redirectToProduct && redirectToProductStats(id || ''))}
                >
                    <Translate value="actionsDropdown.viewStats" />
                </DropdownActions.Item>
            }
            {!!process.env.COMMUNITY_PRODUCTS && isCommunity &&
                <DropdownActions.Item
                    className={styles.item}
                    onClick={() => (!!redirectToProduct && redirectToProductMembers(id || ''))}
                >
                    <Translate value="actionsDropdown.viewCommunity" />
                </DropdownActions.Item>
            }
            <DropdownActions.Item
                className={styles.item}
                onClick={() => copyUrl(id || '')}
                disabled={state !== productStates.DEPLOYED}
            >
                <Translate value="actionsDropdown.copyUrl" />
            </DropdownActions.Item>
        </Fragment>
    )
}

const ProductsPage = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters()
        return [
            filters.NAME_ASC,
            filters.NAME_DESC,
            filters.PUBLISHED,
            filters.DRAFT,
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
    const communityStats = useSelector(selectCommunityProducts)
    const fetchingCommunityStats = useSelector(selectFetchingCommunityStats)
    const [members, setMembers] = useState({})

    useEffect(() => {
        if (!communityStats || communityStats.length === 0) { return }

        setMembers(communityStats.reduce((result, { id, memberCount }) => {
            if (!memberCount) { return result }

            return {
                ...result,
                [id.toLowerCase()]: memberCount.total,
            }
        }, {}))
    }, [communityStats])

    useEffect(() => {
        dispatch(getMyProducts(filter))
    }, [dispatch, filter])

    useEffect(() => {
        dispatch(getAllCommunityStats())
    }, [dispatch])

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
                <TileGrid>
                    {products.map((product) => {
                        const isCommunity = isCommunityProduct(product)
                        const beneficiaryAddress = (product.beneficiaryAddress || '').toLowerCase()
                        const memberCount = members[beneficiaryAddress]

                        return (
                            <Link
                                key={product.id}
                                to={product.id && getProductLink(product.id)}
                            >
                                <Tile
                                    imageUrl={product.imageUrl || ''}
                                    dropdownActions={<Actions {...product} />}
                                    labels={{
                                        community: isCommunity,
                                    }}
                                    badges={(isCommunity && memberCount !== undefined) ? {
                                        members: memberCount,
                                    } : undefined}
                                    deploying={!fetchingCommunityStats && (isCommunity && memberCount === undefined)}
                                >
                                    <Tile.Title>{product.name}</Tile.Title>
                                    <Tile.Tag >
                                        {product.updated === product.created ? 'Created ' : 'Updated '}
                                        {product.updated && generateTimeAgoDescription(new Date(product.updated))}
                                    </Tile.Tag>
                                    <Tile.Tag
                                        className={product.state === productStates.DEPLOYED ? styles.green : styles.grey}
                                    >
                                        {
                                            product.state === productStates.DEPLOYED ?
                                                <Translate value="userpages.products.published" /> :
                                                <Translate value="userpages.products.draft" />
                                        }
                                    </Tile.Tag>
                                </Tile>
                            </Link>
                        )
                    })}
                </TileGrid>
            </ListContainer>
            <DocsShortcuts />
            <CreateProductModal />
        </Layout>
    )
}

export default ProductsPage
