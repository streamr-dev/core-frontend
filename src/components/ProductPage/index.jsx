// @flow

import React, { Component } from 'react'

import type { Product } from '../../flowtype/product-types'
import type { Match } from 'react-router-dom'
import type { ErrorInUi } from '../../flowtype/common-types'
import { Container } from '@streamr/streamr-layout'
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

export default class ProductPage extends Component<Props, {}> {
    componentDidMount() {
        this.props.getProductById(this.props.match.params.id)
    }

    render() {
        return (
            <div className={styles.productPage}>
                <Container>
                    {this.props.product && <h1>{this.props.product.name}</h1>}
                </Container>
            </div>
        )
    }
}
