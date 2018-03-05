// @flow
import React, {Component} from 'react'
import { connect } from 'react-redux'

import ProductsComponent from '../../components/Products'
import Search from '../../components/Search'

import type { StoreState } from '../../flowtype/store-state'
import type { ProductList } from '../../flowtype/product-types'
import type { CategoryList } from '../../flowtype/category-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { getProducts, updateSearchText } from '../../modules/productList/actions'
import { getCategories } from '../../modules/categories/actions'
import { selectFetchingCategories, selectAllCategories, selectCategoriesError } from '../../modules/categories/selectors'
import { selectFetchingProductList, selectProductList, selectProductListError, selectSearchText } from '../../modules/productList/selectors'

type StateProps = {
    fetchingCategories: boolean,
    categories: CategoryList,
    categoriesError: ?ErrorInUi,
    fetchingProducts: boolean,
    products: ProductList,
    productsError: ?ErrorInUi,
    searchText: string,
}

type DispatchProps = {
    getProducts: () => void,
    getCategories: () => void,
    onSearchFieldChange: (string) => void,
}

type Props = StateProps & DispatchProps

type State = {}

export class Products extends Component<Props, State> {
    componentWillMount() {
        this.props.getCategories()
        this.props.getProducts()
    }

    render() {
        const { products, productsError, searchText, onSearchFieldChange } = this.props

        return (
            <div>
                <Search value={searchText} onChange={onSearchFieldChange} />
                <ProductsComponent products={products} error={productsError} />
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        fetchingCategories: selectFetchingCategories(state),
        categories: selectAllCategories(state),
        categoriesError: selectCategoriesError(state),
        fetchingProducts: selectFetchingProductList(state),
        products: selectProductList(state),
        productsError: selectProductListError(state),
        searchText: selectSearchText(state),
    }
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProducts: () => dispatch(getProducts()),
    getCategories: () => dispatch(getCategories()),
    onSearchFieldChange: (text) => dispatch(updateSearchText(text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Products)
