// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {values} from 'lodash'
import {getProducts} from '../../actions/ProductActions'

import type {Product} from '../../flowtype/product-types'
import type {ProductState} from '../../flowtype/states/product-state'
import type {ErrorInUi} from '../../flowtype/common-types'

type StateProps = {
    products: Array<Product>,
    error: ?ErrorInUi
}

type DispatchProps = {
    getProducts: () => void
}

type Props = StateProps & DispatchProps

type State = {}

import styles from './products.pcss'

export class Products extends Component<Props, State> {
    componentWillMount() {
        this.props.getProducts()
    }
    render() {
        return (
            <div className={styles.products}>
                Products
                {this.props.error && (
                    <div style={{
                        background: 'red'
                    }}>
                        {this.props.error.message}
                    </div>
                )}
                {this.props.products.map(p => (
                    <div key={p.id}>
                        {JSON.stringify(p)}
                    </div>
                ))}
            </div>
        )
    }
}

const mapStateToProps = ({product}: {product: ProductState}): StateProps => ({
    // Using lodash since flow is having some problem with Object.values
    products: values(product.byId),
    error: product.error
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProducts() {
        dispatch(getProducts())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Products)
