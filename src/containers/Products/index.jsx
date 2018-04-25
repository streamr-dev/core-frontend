// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'

import ProductsComponent from '../../components/Products'
import ActionBar from '../../components/ActionBar'

import type { StoreState } from '../../flowtype/store-state'
import type { ProductList, Filter } from '../../flowtype/product-types'
import type { CategoryList } from '../../flowtype/category-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import {
    updateFilter,
    clearFilters,
    loadMoreProducts as loadMoreProductsAction,
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
    getCategories: () => void,
    onFilterChange: (filter: Filter) => void,
    clearFiltersAndReloadProducts: () => void,
    loadMoreProducts: () => void,
}

type Props = StateProps & DispatchProps

type State = {}

export class Products extends Component<Props, State> {
    componentWillMount() {
        this.props.getCategories()

        // Make sure we don't reset state if it's not necessary
        if (this.props.products.length === 0) {
            this.props.clearFiltersAndReloadProducts()
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
            loadMoreProducts,
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
                    products={products}
                    error={productsError}
                    isFetching={isFetching}
                    loadMoreProducts={loadMoreProducts}
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
    getCategories: () => dispatch(getCategories()),
    onFilterChange: (filter: Filter) => {
        dispatch(updateFilter(filter))
        dispatch(clearSearchResults())
        dispatch(loadMoreProductsAction())
    },
    clearFiltersAndReloadProducts: () => {
        dispatch(clearFilters())
        dispatch(clearSearchResults())
        dispatch(loadMoreProductsAction())
    },
    loadMoreProducts: () => dispatch(loadMoreProductsAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Products)
