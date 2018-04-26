// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { set } from 'lodash'

import ProductsComponent from '../../components/Products'
import ActionBar from '../../components/ActionBar'

import type { StoreState } from '../../flowtype/store-state'
import type { ProductList, Filter } from '../../flowtype/product-types'
import type { CategoryList } from '../../flowtype/category-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import {
    getProducts,
    updateFilter,
    clearFilters,
    clearSearchResults,
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
    clearFiltersAndReloadProducts: () => void,
}

type Props = StateProps & DispatchProps

type State = {}

export class Products extends Component<Props, State> {
    componentWillMount() {
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
            categories,
            isFetching,
            loadProducts,
            hasMoreSearchResults,
        } = this.props

        return (
            <div>
                <ActionBar
                    filter={filter}
                    categories={categories}
                    onChange={onFilterChange}
                />
                <ProductsComponent
                    products={products.map((p, i) => set(p, 'key', `${i}-${p.id || ''}`))}
                    error={productsError}
                    type="products"
                    isFetching={isFetching}
                    loadProducts={loadProducts}
                    hasMoreSearchResults={hasMoreSearchResults}
                />
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    categories: selectAllCategories(state),
    products: selectProductList(state),
    productsError: selectProductListError(state),
    filter: selectFilter(state),
    isFetching: selectFetchingProductList(state),
    hasMoreSearchResults: selectHasMoreSearchResults(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    loadCategories: () => dispatch(getCategories()),
    loadProducts: () => dispatch(getProducts()),
    onFilterChange: (filter: Filter) => {
        dispatch(updateFilter(filter))
        dispatch(clearSearchResults())
        dispatch(getProducts(500))
    },
    clearFiltersAndReloadProducts: () => {
        dispatch(clearFilters())
        dispatch(clearSearchResults())
        dispatch(getProducts())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Products)
