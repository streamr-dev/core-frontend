// @flow

/* eslint-disable react/no-unused-prop-types */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import merge from 'lodash/merge'
import { frontloadConnect } from 'react-frontload'

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
    loadCategories: () => Promise<void>,
    loadProducts: () => Promise<void>,
    onFilterChange: (filter: Filter) => void,
    onSearchChange: (filter: Filter) => void,
    clearFiltersAndReloadProducts: () => Promise<void>,
}

type Props = StateProps & DispatchProps

export class Products extends Component<Props> { // eslint-disable-line react/prefer-stateless-function
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

const frontload = (props: Props) => {
    const { loadCategories, products, clearFiltersAndReloadProducts } = props

    return Promise.all([
        loadCategories(),
        products.length === 0 ? clearFiltersAndReloadProducts() : Promise.resolve(),
    ])
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
    loadCategories: async () => {
        await dispatch(getCategories(false))
    },
    loadProducts: async () => {
        await dispatch(getProducts())
    },
    onFilterChange: (filter: Filter) => {
        dispatch(updateFilter(filter))
        dispatch(getProducts(true))
    },
    onSearchChange: (filter: Filter) => {
        dispatch(updateFilter(filter))
        dispatch(getProductsDebounced(true))
    },
    clearFiltersAndReloadProducts: async () => {
        dispatch(clearFilters())
        await dispatch(getProducts(true))
    },
})

const a = frontloadConnect(frontload)(Products)

export default connect(mapStateToProps, mapDispatchToProps)(a)
