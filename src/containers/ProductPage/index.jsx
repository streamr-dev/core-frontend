// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import ProductPageComponent from '../../components/ProductPage'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Product } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'

import { getProductById } from '../../modules/product/actions'
import {
    selectFetchingProduct,
    selectProduct,
    selectProductError,
    selectStreams,
    selectFetchingStreams,
    selectStreamsError,
} from '../../modules/product/selectors'
import { showModal } from '../../modules/ui/actions'
import { PURCHASE_DIALOG } from '../../utils/modals'

export type OwnProps = {
    match: Match,
}

export type StateProps = {
    fetchingProduct: boolean,
    product: ?Product,
    fetchingStreams: boolean,
    streams: StreamList,
    productError: ?ErrorInUi,
    streamsError: ?ErrorInUi,
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
    onPurchase: () => void,
}

type Props = OwnProps & StateProps & DispatchProps

class ProductPage extends Component<Props> {
    componentDidMount() {
        this.props.getProductById(this.props.match.params.id)
    }

    render() {
        const { product, streams, fetchingProduct, fetchingStreams, onPurchase } = this.props

        return !!product && (
            <ProductPageComponent
                product={product}
                streams={streams}
                fetchingStreams={fetchingProduct || fetchingStreams}
                onPurchase={onPurchase}
            />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    streams: selectStreams(state),
    fetchingProduct: selectFetchingProduct(state),
    productError: selectProductError(state),
    fetchingStreams: selectFetchingStreams(state),
    streamsError: selectStreamsError(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    onPurchase: () => dispatch(showModal(PURCHASE_DIALOG)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
