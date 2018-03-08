// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import ProductPageComponent from '../../components/ProductPage'
import type { Props as ProductPageProps } from '../../components/ProductPage'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'

import { getProductById } from '../../modules/product/actions'
import { selectProduct, selectProductStreams, selectProductError } from '../../modules/product/selectors'

export type OwnProps = {
    match: Match,
}

export type StateProps = ProductPageProps & {
    streams: ?StreamList,
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
}

type Props = OwnProps & StateProps & DispatchProps

class ProductPage extends Component<Props> {
    componentDidMount() {
        this.props.getProductById(this.props.match.params.id)
    }

    render() {
        const { product, streams } = this.props

        return !!product && (
            <ProductPageComponent product={product} streams={streams} />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    error: selectProductError(state),
    streams: selectProductStreams(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
