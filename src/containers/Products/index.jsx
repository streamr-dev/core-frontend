// @flow
import React, {Component} from 'react'
import { connect } from 'react-redux'

import ProductsComponent from '../../components/Products'
import Search from '../../Components/Search'

import type { StoreState } from '../../flowtype/store-state'
import type { ProductList } from '../../flowtype/product-types'
import type { CategoryList } from '../../flowtype/category-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { getProducts } from '../../modules/productList/actions'
import { getCategories } from '../../modules/categories/actions'
import { selectFetchingCategories, selectAllCategories, selectCategoriesError } from '../../modules/categories/selectors'
import { selectFetchingProductList, selectProductList, selectProductListError } from '../../modules/productList/selectors'

type StateProps = {
    fetchingCategories: boolean,
    categories: CategoryList,
    categoriesError: ?ErrorInUi,
    fetchingProducts: boolean,
    products: ProductList,
    productsError: ?ErrorInUi,
}

type DispatchProps = {
    getProducts: () => void,
    getCategories: () => void,
}

type Props = StateProps & DispatchProps

type State = {}

export class Products extends Component<Props, State> {
    componentWillMount() {
        this.props.getCategories()
        this.props.getProducts()
    }

    render() {
        const { products, productsError } = this.props

        return (
            <div>
                <Search />
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
        productsError: selectProductListError(state)
    }
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProducts: () => dispatch(getProducts()),
    getCategories: () => dispatch(getCategories())
})

export default connect(mapStateToProps, mapDispatchToProps)(Products)
