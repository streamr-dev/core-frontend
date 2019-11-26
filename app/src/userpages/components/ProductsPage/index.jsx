// @flow

import React, { Fragment, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
import Button from '$shared/components/Button'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useCopy from '$shared/hooks/useCopy'

import type { ProductId, Product } from '$mp/flowtype/product-types'
import type { SortOption } from '$userpages/flowtype/common-types'

import styles from './products.pcss'

const CreateProductButton = () => (
    <Button
        className={styles.createProductButton}
        tag={Link}
        to={links.marketplace.createProduct}
    >
        <Translate value="userpages.products.createProduct" />
    </Button>
)

const getSortOptions = (): Array<SortOption> => {
    const filters = getFilters()
    return [
        filters.NAME_ASC,
        filters.NAME_DESC,
        filters.PUBLISHED,
        filters.DRAFT,
    ]
}

const generateTimeAgoDescription = (productUpdatedDate: Date) => moment(productUpdatedDate).fromNow()

const Actions = ({ id, state }: Product) => {
    const { copy } = useCopy()
    const dispatch = useDispatch()

    const redirectToEditProduct = useCallback((id: ProductId) => (
        dispatch(push(formatPath(links.marketplace.products, id, 'edit')))
    ), [dispatch])
    const redirectToPublishProduct = useCallback((id: ProductId) => (
        dispatch(push(formatPath(links.marketplace.products, id, 'publish')))
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
            {(state === productStates.DEPLOYED || state === productStates.NOT_DEPLOYED) &&
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
            <DropdownActions.Item
                className={styles.item}
                onClick={() => copyUrl(id || '')}
            >
                <Translate value="actionsDropdown.copyUrl" />
            </DropdownActions.Item>
        </Fragment>
    )
}

const ProductsPage = () => {
    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(getSortOptions())
    const products = useSelector(selectMyProductList)
    const fetching = useSelector(selectFetching)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getMyProducts(filter))
    }, [dispatch, filter])

    const onSearchChange = useCallback((value: string) => {
        setSearch(value)
    }, [setSearch])

    const onSortChange = useCallback((sortOptionId) => {
        setSort(sortOptionId)
    }, [setSort])

    return (
        <Layout
            headerAdditionalComponent={<CreateProductButton />}
            headerSearchComponent={
                <Search
                    placeholder={I18n.t('userpages.products.filterProducts')}
                    value={(filter && filter.search) || ''}
                    onChange={onSearchChange}
                />
            }
            headerFilterComponent={
                <Dropdown
                    title={I18n.t('userpages.filter.sortBy')}
                    onChange={onSortChange}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                >
                    {getSortOptions().map((s) => (
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
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            to={product.id && `${links.marketplace.products}/${product.id}`}
                        >
                            <Tile
                                imageUrl={product.imageUrl || ''}
                                dropdownActions={<Actions {...product} />}
                                labels={{
                                    community: isCommunityProduct(product),
                                }}
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
                    ))}
                </TileGrid>
            </ListContainer>
            <DocsShortcuts />
        </Layout>
    )
}

export default ProductsPage
