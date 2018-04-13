// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'
import { ModalRoute } from 'react-router-modal'

import ProductPageComponent from '../../components/ProductPage'
import { formatPath } from '../../utils/url'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'

import { getProductById, getProductSubscription } from '../../modules/product/actions'
import {
    selectFetchingProduct,
    selectProduct,
    selectStreams,
    selectFetchingStreams,
    selectContractSubscriptionIsValid,
} from '../../modules/product/selectors'
import { selectLoginKey } from '../../modules/user/selectors'
import links from '../../links'

import PurchaseDialog from './PurchaseDialog'
import PublishDialog from './PublishDialog'

export type OwnProps = {
    match: Match,
}

export type StateProps = {
    fetchingProduct: boolean,
    product: ?Product,
    fetchingStreams: boolean,
    streams: StreamList,
    fetchingProduct: boolean,
    isLoggedIn?: boolean,
    isProductSubscriptionValid?: boolean,
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
    getProductSubscription: (ProductId) => void,
}

type Props = OwnProps & StateProps & DispatchProps

class ProductPage extends Component<Props> {
    componentDidMount() {
        this.props.getProductById(this.props.match.params.id)
        this.props.getProductSubscription(this.props.match.params.id)
    }

    render() {
        const {
            match,
            product,
            streams,
            fetchingProduct,
            fetchingStreams,
            isLoggedIn,
            isProductSubscriptionValid,
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
                    showStreamActions
                    isLoggedIn={isLoggedIn}
                    isProductSubscriptionValid={isProductSubscriptionValid}
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
    isLoggedIn: selectLoginKey(state) !== null,
    isProductSubscriptionValid: selectContractSubscriptionIsValid(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    getProductSubscription: (id: ProductId) => dispatch(getProductSubscription(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
