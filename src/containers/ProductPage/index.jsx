// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'
import ProductPageComponent from '../../components/ProductPage'
import { ModalRoute } from 'react-router-modal'

import { formatPath } from '../../utils/url'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'

import { getProductById } from '../../modules/product/actions'
import {
    selectFetchingProduct,
    selectProduct,
    selectStreams,
    selectFetchingStreams,
} from '../../modules/product/selectors'
import PurchaseDialog from './PurchaseDialog'
import PublishDialog from './PublishDialog'

import links from '../../links'

export type OwnProps = {
    match: Match,
}

export type StateProps = {
    fetchingProduct: boolean,
    product: ?Product,
    fetchingStreams: boolean,
    streams: StreamList,
    fetchingProduct: boolean
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
        const {
            match, product, streams, fetchingProduct, fetchingStreams,
        } = this.props

        return !!product && (
            <div>
                <ProductPageComponent
                    product={product}
                    streams={streams}
                    fetchingStreams={fetchingProduct || fetchingStreams}
                    isUserOwner
                    showToolbar
                    toolbarActions={{
                        edit: {
                            title: 'Edit',
                            linkTo: formatPath(links.products, product.id || '', 'edit'),
                        },
                        publish: {
                            title: 'Publish',
                            color: 'primary',
                            linkTo: formatPath(links.products, product.id || '', 'publish'),
                        },
                    }}
                />
                <ModalRoute path={formatPath(links.products, ':id', 'purchase')} parentPath={match.url} component={PurchaseDialog} />
                <ModalRoute path={formatPath(links.products, ':id', 'publish')} parentPath={match.url} component={PublishDialog} />
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    streams: selectStreams(state),
    fetchingProduct: selectFetchingProduct(state),
    fetchingStreams: selectFetchingStreams(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
