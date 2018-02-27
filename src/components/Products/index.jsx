// @flow

import React, {Component} from 'react'

import type {Product} from '../../flowtype/product-types'
import type {ErrorInUi} from '../../flowtype/common-types'

export type StateProps = {
    products: Array<Product>,
    error: ?ErrorInUi
}

export type DispatchProps = {
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
                {this.props.products && this.props.products.map(p => (
                    <div key={p.id}>
                        {JSON.stringify(p)}
                    </div>
                ))}
            </div>
        )
    }
}

export default Products
