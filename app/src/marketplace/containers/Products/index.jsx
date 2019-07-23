// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import merge from 'lodash/merge'
import Helmet from 'react-helmet'
import { I18n } from 'react-redux-i18n'

import ProductsComponent from '../../components/Products'
import ActionBar from '../../components/ActionBar'
import Layout from '../../components/Layout'

import type { StoreState } from '../../flowtype/store-state'
import type { ProductList, Filter } from '../../flowtype/product-types'
import type { CategoryList } from '../../flowtype/category-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

import {
    getProducts,
    getProductsDebounced,
    updateFilter,
    clearFilters,
} from '../../modules/productList/actions'
import { getCategories } from '../../modules/categories/actions'
import { selectAllCategories } from '../../modules/categories/selectors'
import {
    selectProductList,
    selectProductListError,
    selectFilter,
    selectFetchingProductList,
    selectHasMoreSearchResults,
} from '../../modules/productList/selectors'

type StateProps = {
    categories: CategoryList,
    products: ProductList,
    productsError: ?ErrorInUi,
    filter: Filter,
    isFetching: boolean,
    hasMoreSearchResults: boolean,
}

type DispatchProps = {
    loadCategories: () => void,
    loadProducts: () => void,
    onFilterChange: (filter: Filter) => void,
    onSearchChange: (filter: Filter) => void,
    clearFiltersAndReloadProducts: () => void,
}

type Props = StateProps & DispatchProps

type State = {}

export class Products extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        const { loadCategories, products, clearFiltersAndReloadProducts } = this.props

        loadCategories()

        // Make sure we don't reset state if it's not necessary
        if (products.length === 0) {
            clearFiltersAndReloadProducts()
        }
    }

    render() {
        const {
            products,
            productsError,
            filter,
            onFilterChange,
            onSearchChange,
            categories,
            isFetching,
            loadProducts,
            hasMoreSearchResults,
        } = this.props

        return (
            <Layout>
                <Helmet title={I18n.t('general.title.suffix')} />
                <ActionBar
                    filter={filter}
                    categories={categories}
                    onCategoryChange={onFilterChange}
                    onSortChange={onFilterChange}
                    onSearchChange={onSearchChange}
                />
                <ProductsComponent
                    products={products.map((p, i) => merge({}, p, {
                        key: `${i}-${p.id || ''}`,
                    }))}
                    error={productsError}
                    type="products"
                    isFetching={isFetching}
                    loadProducts={loadProducts}
                    hasMoreSearchResults={hasMoreSearchResults}
                />
            </Layout>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    categories: selectAllCategories(state),
    products: selectProductList(state),
    productsError: selectProductListError(state),
    filter: selectFilter(state),
    isFetching: selectFetchingProductList(state),
    hasMoreSearchResults: selectHasMoreSearchResults(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    loadCategories: () => dispatch(getCategories(false)),
    loadProducts: () => dispatch(getProducts()),
    onFilterChange: (filter: Filter) => {
        dispatch(updateFilter(filter))
        dispatch(getProducts(true))
    },
    onSearchChange: (filter: Filter) => {
        dispatch(updateFilter(filter))
        dispatch(getProductsDebounced(true))
    },
    clearFiltersAndReloadProducts: () => {
        dispatch(clearFilters())
        dispatch(getProducts(true))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Products)
