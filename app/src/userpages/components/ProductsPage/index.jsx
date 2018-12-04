// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'

import Layout from '../Layout'
import links from '../../../links'
import { defaultColumns, getFilters } from '../../utils/constants'
import { getMyProducts, updateFilter } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFilter } from '$mp/modules/myProductList/selectors'
import { productStates } from '$mp/utils/constants'
import Tile from '$shared/components/Tile'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import Search from '$shared/components/Search'
import Dropdown from '$shared/components/Dropdown'

import type { ProductList } from '$mp/flowtype/product-types'
import type { Filter, SortOption } from '$userpages/flowtype/common-types'

import styles from './products.pcss'

export type StateProps = {
    products: ProductList,
    filter: ?Filter,
}

export type DispatchProps = {
    getMyProducts: () => void,
    updateFilter: (Filter) => void,
}

type Props = StateProps & DispatchProps

const CreateProductButton = () => (
    <Button>
        <Link to={links.createProduct}>
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
        // Set default filter if not selected
        if (!this.props.filter) {
            this.props.updateFilter(this.defaultFilter)
        }
        this.props.getMyProducts()
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

    render() {
        const { products, filter } = this.props

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
            >
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
                                    link={product.id && `${links.products}/${product.id}`}
                                >
                                    <Tile.Title>{product.name}</Tile.Title>
                                    <Tile.Tag
                                        className={product.state === productStates.DEPLOYED ? styles.purple : styles.gray}
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
            </Layout>
        )
    }
}

export const mapStateToProps = (state: any): StateProps => ({
    products: selectMyProductList(state),
    filter: selectFilter(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getMyProducts: () => dispatch(getMyProducts()),
    updateFilter: (filter: Filter) => dispatch(updateFilter(filter)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductsPage)
