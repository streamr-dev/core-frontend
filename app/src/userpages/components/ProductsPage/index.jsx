// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'
import copy from 'copy-to-clipboard'
import Helmet from 'react-helmet'
import moment from 'moment'

import Layout from '../Layout'
import links from '../../../links'
import { defaultColumns, getFilters } from '../../utils/constants'
import { getMyProducts, updateFilter } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFilter, selectFetching } from '$mp/modules/myProductList/selectors'
import { productStates } from '$shared/utils/constants'
import Tile from '$shared/components/Tile'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import Search from '$shared/components/Search'
import Dropdown from '$shared/components/Dropdown'
import { formatPath, formatExternalUrl } from '$shared/utils/url'
import DropdownActions from '$shared/components/DropdownActions'
import DocsShortcuts from '$userpages/components/DocsShortcuts'

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
    <Button color="primary">
        <Link to={links.marketplace.createProduct}>
            <Translate value="userpages.products.createProduct" />
        </Link>
    </Button>
)

const getSortOptions = (): Array<SortOption> => {
    const filters = getFilters()
    return [
        filters.PUBLISHED,
        filters.DRAFT,
        filters.NAME_ASC,
        filters.NAME_DESC,
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
                        defaultSelectedItem={(filter && filter.id) || this.defaultFilter.id}
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
                <Helmet>
                    <title>{I18n.t('userpages.title.products')}</title>
                </Helmet>
                <Container>
                    {!products.length && (
                        <EmptyState
                            image={(
                                <img
                                    src={emptyStateIcon}
                                    srcSet={`${emptyStateIcon2x} 2x`}
                                    alt={I18n.t('error.notFound')}
                                />
                            )}
                        >
                            <Translate value="userpages.products.noProducts.title" />
                            <Translate value="userpages.products.noProducts.message" tag="small" />
                        </EmptyState>
                    )}
                    <Row>
                        {products.map((product) => (
                            <Col {...defaultColumns} key={product.id}>
                                <Tile
                                    imageUrl={product.imageUrl}
                                    link={product.id && `${links.marketplace.products}/${product.id}`}
                                    dropdownActions={this.getActions(product)}
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
                            </Col>
                        ))}
                    </Row>
                </Container>
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
