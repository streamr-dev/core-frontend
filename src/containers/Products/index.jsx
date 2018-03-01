// @flow
import React, {Component} from 'react'
import { connect } from 'react-redux'

import ProductList from '../../components/ProductList'
import type { ProductProps } from '../../components/ProductList'
import type { StoreState } from '../../flowtype/store-state'

import { getProducts } from '../../modules/productList/actions'
import { selectProducts, selectError } from '../../modules/productList/selectors'

export type DispatchProps = {
    getProducts: () => void
}

type Props = ProductProps & DispatchProps

type State = {}

export class Products extends Component<Props, State> {
    componentWillMount() {
        this.props.getProducts()
    }

    render() {
        return (
            <ProductList {...this.props} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Products)
