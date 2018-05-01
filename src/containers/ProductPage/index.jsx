// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import ProductPageComponent from '../../components/ProductPage'
import { formatPath } from '../../utils/url'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'
import { productStates } from '../../utils/constants'

import { getProductById, getProductSubscription, purchaseProduct } from '../../modules/product/actions'
import { getUserProductPermissions } from '../../modules/user/actions'
import { PURCHASE, PUBLISH } from '../../utils/modals'
import { showModal } from '../../modules/modals/actions'

import {
    selectFetchingProduct,
    selectProduct,
    selectStreams,
    selectFetchingStreams,
    selectSubscriptionIsValid,
} from '../../modules/product/selectors'

import {
    selectLoginKey,
    selectProductEditPermission,
    selectProductPublishPermission,
} from '../../modules/user/selectors'

import links from '../../links'

export type OwnProps = {
    match: Match,
    overlayPurchaseDialog: boolean,
    overlayPublishDialog: boolean,
}

export type StateProps = {
    fetchingProduct: boolean,
    product: ?Product,
    fetchingStreams: boolean,
    streams: StreamList,
    fetchingProduct: boolean,
    isLoggedIn?: boolean,
    isProductSubscriptionValid?: boolean,
    editPermission: boolean,
    publishPermission: boolean,
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
    getProductSubscription: (ProductId) => void,
    getUserProductPermissions: (ProductId) => void,
    onPurchase: () => void,
    showPurchaseDialog: () => void,
    showPublishDialog: () => void,
}

type Props = OwnProps & StateProps & DispatchProps
class ProductPage extends Component<Props> {
    componentDidMount() {
        const { id } = this.props.match.params
        this.props.getProductById(id)
        this.props.getProductSubscription(id)
        this.props.getUserProductPermissions(id)
    }

    componentWillReceiveProps(nextProps: Props) {
        const {
            product,
            overlayPurchaseDialog,
            overlayPublishDialog,
            showPurchaseDialog,
            showPublishDialog,
        } = nextProps

        if (product) {
            if (overlayPurchaseDialog) {
                showPurchaseDialog()
            } else if (overlayPublishDialog) {
                showPublishDialog()
            }
        }
    }

    render() {
        const {
            product,
            streams,
            fetchingProduct,
            fetchingStreams,
            isLoggedIn,
            isProductSubscriptionValid,
            editPermission,
            publishPermission,
            onPurchase,
        } = this.props

        const toolbarActions = {}
        if (product && editPermission) {
            toolbarActions.edit = {
                title: 'Edit',
                linkTo: formatPath(links.products, product.id || '', 'edit'),
            }
        }

        if (product && publishPermission) {
            toolbarActions.publish = {
                title: product.state === productStates.NOT_DEPLOYED ? 'Publish' : 'Unpublish',
                color: 'primary',
                linkTo: formatPath(links.products, product.id || '', 'publish'),
            }
        }
        return !!product && (
            <div>
                <ProductPageComponent
                    product={product}
                    streams={streams}
                    fetchingStreams={fetchingProduct || fetchingStreams}
                    showToolbar={editPermission}
                    toolbarActions={toolbarActions}
                    showStreamActions
                    isLoggedIn={isLoggedIn}
                    isProductSubscriptionValid={isProductSubscriptionValid}
                    onPurchase={onPurchase}
                />
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
    editPermission: selectProductEditPermission(state),
    publishPermission: selectProductPublishPermission(state),
    isProductSubscriptionValid: selectSubscriptionIsValid(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    getProductSubscription: (id: ProductId) => dispatch(getProductSubscription(id)),
    getUserProductPermissions: (id: ProductId) => dispatch(getUserProductPermissions(id)),
    onPurchase: () => dispatch(purchaseProduct()),
    showPurchaseDialog: () => dispatch(showModal(PURCHASE, {
        ...ownProps,
    })),
    showPublishDialog: () => dispatch(showModal(PUBLISH, {
        ...ownProps,
    })),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
