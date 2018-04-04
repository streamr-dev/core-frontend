// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'

import ProductsComponent from '../../components/Products'
import Search from '../../components/Search'

import type { StoreState } from '../../flowtype/store-state'
import type { ProductList, Filter } from '../../flowtype/product-types'
import type { CategoryList } from '../../flowtype/category-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { getProducts, updateFilter, clearFilters } from '../../modules/productList/actions'
import { getCategories } from '../../modules/categories/actions'
import { selectAllCategories } from '../../modules/categories/selectors'
import { selectProductList, selectProductListError, selectFilter } from '../../modules/productList/selectors'

type StateProps = {
    categories: CategoryList,
    products: ProductList,
    productsError: ?ErrorInUi,
    filter: Filter,
}

type DispatchProps = {
    getCategories: () => void,
    onFilterChange: (filter: Filter) => void,
    clearFiltersAndReloadProducts: () => void,
}

type Props = StateProps & DispatchProps

type State = {}

export class Products extends Component<Props, State> {
    componentWillMount() {
        this.props.getCategories()
        this.props.clearFiltersAndReloadProducts()
    }

    render() {
        const {
            products,
            productsError,
            filter,
            onFilterChange,
            clearFiltersAndReloadProducts,
            categories,
        } = this.props

        return (
            <div>
                <Search
                    filter={filter}
                    categories={categories}
                    onChange={onFilterChange}
                    onClearFilters={clearFiltersAndReloadProducts}
                />
                <ProductsComponent products={products} error={productsError} />
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    categories: selectAllCategories(state),
    products: selectProductList(state),
    productsError: selectProductListError(state),
    filter: selectFilter(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getCategories: () => dispatch(getCategories()),
    onFilterChange: (filter: Filter) => {
        dispatch(updateFilter(filter))
        dispatch(getProducts())
    },
    clearFiltersAndReloadProducts: () => {
        dispatch(clearFilters())
        dispatch(getProducts())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Products)
