// @flow

import React, { Component } from 'react'
import Hero from './Hero'
import Details from './Details'
import Preview from './Preview'
import RelatedProducts from './RelatedProducts'

import type { Product } from '../../flowtype/product-types'
import type { Match } from 'react-router-dom'
import type { ErrorInUi } from '../../flowtype/common-types'
import styles from './styles.pcss'

export type OwnProps = {
    match: Match,
}

export type StateProps = {
    product: ?Product,
    error: ?ErrorInUi,
}

export type DispatchProps = {
    getProductById: ($ElementType<Product, 'id'>) => void,
}

type Props = OwnProps & StateProps & DispatchProps

export default class ProductPage extends Component<Props> {
    componentDidMount() {
        this.props.getProductById(this.props.match.params.id)
    }

    render() {
        const { product } = this.props

        return !!product && (
            <div className={styles.productPage}>
                <Hero product={product} />
                <Details />
                <Preview />
                <RelatedProducts />
            </div>
        )
    }
}
