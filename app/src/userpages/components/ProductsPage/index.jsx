// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import copy from 'copy-to-clipboard'
import Helmet from 'react-helmet'
import moment from 'moment'

import Layout from '../Layout'
import links from '../../../links'
import { getFilters } from '../../utils/constants'
import { getMyProducts, updateFilter } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFilter, selectFetching } from '$mp/modules/myProductList/selectors'
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

import type { ProductList, ProductId, Product } from '$mp/flowtype/product-types'
import type { Filter, SortOption } from '$userpages/flowtype/common-types'

import styles from './products.pcss'

export type StateProps = {
    products: ProductList,
    filter: ?Filter,
    fetching: boolean,
}

export type DispatchProps = {
    getMyProducts: () => void,
    updateFilter: (Filter) => void,
    redirectToEditProduct: (id: ProductId) => void,
    redirectToPublishProduct: (id: ProductId) => void,
    copyUrl: (id: ProductId) => void,
}

type Props = StateProps & DispatchProps

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

class ProductsPage extends Component<Props> {
    defaultFilter = getSortOptions()[0].filter

    componentDidMount() {
        const { filter, updateFilter, getMyProducts } = this.props

        // Set default filter if not selected
        if (!filter) {
            updateFilter(this.defaultFilter)
        }
        getMyProducts()
    }

    onSearchChange = (value: string) => {
        const { filter, updateFilter, getMyProducts } = this.props
        const newFilter = {
            ...filter,
            search: value,
        }
        updateFilter(newFilter)
        getMyProducts()
    }

    onSortChange = (sortOptionId) => {
        const { filter, updateFilter, getMyProducts } = this.props
        const sortOption = getSortOptions().find((opt) => opt.filter.id === sortOptionId)

        if (sortOption) {
            const newFilter = {
                search: filter && filter.search,
                ...sortOption.filter,
            }
            updateFilter(newFilter)
            getMyProducts()
        }
    }

    resetFilter = () => {
        const { updateFilter, getMyProducts } = this.props
        updateFilter({
            ...this.defaultFilter,
            search: '',
        })
        getMyProducts()
    }

    getActions = ({ id, state }: Product) => {
        const { redirectToEditProduct, redirectToPublishProduct, copyUrl } = this.props

        return (
            <Fragment>
                <DropdownActions.Item
                    className={styles.item}
                    onClick={() => (!!redirectToEditProduct && redirectToEditProduct(id || ''))}
                >
                    <Translate value="actionsDropdown.edit" />
                </DropdownActions.Item>
                {(state === productStates.DEPLOYED || state === productStates.NOT_DEPLOYED) &&
                    <DropdownActions.Item
                        className={styles.item}
                        onClick={() => (!!redirectToPublishProduct && redirectToPublishProduct(id || ''))}
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

    generateTimeAgoDescription = (productUpdatedDate: Date) => moment(productUpdatedDate).fromNow()

    render() {
        const { products, filter, fetching } = this.props

        return (
            <Layout
                headerAdditionalComponent={<CreateProductButton />}
                headerSearchComponent={
                    <Search
                        placeholder={I18n.t('userpages.products.filterProducts')}
                        value={(filter && filter.search) || ''}
                        onChange={this.onSearchChange}
                    />
                }
                headerFilterComponent={
                    <Dropdown
                        title={I18n.t('userpages.filter.sortBy')}
                        onChange={this.onSortChange}
                        selectedItem={(filter && filter.id) || this.defaultFilter.id}
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
                            onResetFilter={this.resetFilter}
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
                                    dropdownActions={this.getActions(product)}
                                    labels={{
                                        community: isCommunityProduct(product),
                                    }}
                                >
                                    <Tile.Title>{product.name}</Tile.Title>
                                    <Tile.Tag >
                                        {product.updated === product.created ? 'Created ' : 'Updated '}
                                        {product.updated && this.generateTimeAgoDescription(new Date(product.updated))}
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
}

export const mapStateToProps = (state: any): StateProps => ({
    products: selectMyProductList(state),
    filter: selectFilter(state),
    fetching: selectFetching(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getMyProducts: () => dispatch(getMyProducts()),
    updateFilter: (filter: Filter) => dispatch(updateFilter(filter)),
    redirectToEditProduct: (id: ProductId) => dispatch(push(formatPath(links.marketplace.products, id, 'edit'))),
    redirectToPublishProduct: (id: ProductId) => dispatch(push(formatPath(links.marketplace.products, id, 'publish'))),
    copyUrl: (id: ProductId) => copy(formatExternalUrl(
        process.env.PLATFORM_ORIGIN_URL,
        links.marketplace.products,
        id,
    )),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductsPage)
