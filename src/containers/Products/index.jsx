// @flow
import React, {Component} from 'react'
import { connect } from 'react-redux'

import ProductList from '../../components/ProductList'
import type { ProductProps } from '../../components/Products'
import type { StoreState } from '../../flowtype/store-state'

import { getProducts } from '../../modules/products/actions'
import { selectProducts, selectError } from '../../modules/products/selectors'

export type DispatchProps = {
    getProducts: () => void
}

type Props = ProductProps & DispatchProps

type State = {}

export class ProductsContainer extends Component<Props, State> {
    componentWillMount() {
        this.props.getProducts()
    }

    render() {
        const { products } = this.props

        return (
            <ProductList products={products} />
        )
    }
}

const mapStateToProps = (state: StoreState): ProductProps => {
    return {
        products: selectProducts(state),
        error: selectError(state)
    }
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProducts: () => dispatch(getProducts())
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductsContainer)
