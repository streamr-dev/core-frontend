// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import ProductPageComponent from '../../components/ProductPage'
import { formatPath } from '../../utils/url'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { StreamId, StreamList } from '../../flowtype/stream-types'
import { productStates } from '../../utils/constants'

import { getProductById, getProductSubscription, purchaseProduct } from '../../modules/product/actions'
import { getUserProductPermissions } from '../../modules/user/actions'
import { PURCHASE, PUBLISH, STREAM_LIVE_DATA } from '../../utils/modals'
import { showModal } from '../../modules/modals/actions'
import { isPaidProduct } from '../../utils/product'
import { doExternalLogin } from '../../utils/auth'

import {
    selectFetchingProduct,
    selectProduct,
    selectStreams,
    selectFetchingStreams,
    selectSubscriptionIsValid,
} from '../../modules/product/selectors'
import {
    selectApiKey,
    selectProductEditPermission,
    selectProductPublishPermission,
} from '../../modules/user/selectors'
import links from '../../links'

export type OwnProps = {
    match: Match,
    overlayPurchaseDialog: boolean,
    overlayPublishDialog: boolean,
    overlayStreamLiveDataDialog: boolean,
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
    onPurchase: (ProductId, boolean) => void,
    showPurchaseDialog: (Product) => void,
    showPublishDialog: (Product) => void,
    showStreamLiveDataDialog: (StreamId) => void,
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
            match: { params: { streamId } },
            product,
            overlayPurchaseDialog,
            overlayPublishDialog,
            showPurchaseDialog,
            showPublishDialog,
            showStreamLiveDataDialog,
            overlayStreamLiveDataDialog,
        } = nextProps

        if (product) {
            if (overlayPurchaseDialog) {
                showPurchaseDialog(product)
            } else if (overlayPublishDialog) {
                showPublishDialog(product)
            } else if (overlayStreamLiveDataDialog) {
                showStreamLiveDataDialog(streamId)
            }
        }
    }

    getPublishButtonTitle = (product: Product) => {
        switch (product.state) {
            case productStates.DEPLOYED:
                return 'Unpublish'
            case productStates.NOT_DEPLOYED:
                return 'Publish'
            case productStates.DEPLOYING:
                return 'Publishing'
            case productStates.UNDEPLOYING:
                return 'Unpublishing'
            default:
                return 'Publish'
        }
    }

    getPublishButtonDisabled = (product: Product) => {
        if (product.state === productStates.DEPLOYING ||
            product.state === productStates.UNDEPLOYING) {
            return true
        }
        return false
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
                title: this.getPublishButtonTitle(product),
                disabled: this.getPublishButtonDisabled(product),
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
                    onPurchase={() => onPurchase(product.id || '', !!isLoggedIn)}
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
    isLoggedIn: selectApiKey(state) !== null,
    editPermission: selectProductEditPermission(state),
    publishPermission: selectProductPublishPermission(state),
    isProductSubscriptionValid: selectSubscriptionIsValid(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    getProductSubscription: (id: ProductId) => dispatch(getProductSubscription(id)),
    getUserProductPermissions: (id: ProductId) => dispatch(getUserProductPermissions(id)),
    onPurchase: (id: ProductId, isLoggedIn: boolean) => {
        if (isLoggedIn) {
            dispatch(purchaseProduct())
        } else {
            doExternalLogin(formatPath(links.products, id))
        }
    },
    showPurchaseDialog: (product: Product) => dispatch(showModal(PURCHASE, {
        productId: product.id || '',
        requireInContract: true,
    })),
    showPublishDialog: (product: Product) => dispatch(showModal(PUBLISH, {
        productId: product.id || '',
        requireOwnerIfDeployed: true,
        requireWeb3: isPaidProduct(product),
    })),
    showStreamLiveDataDialog: (streamId: StreamId) => dispatch(showModal(STREAM_LIVE_DATA, {
        ...ownProps,
        streamId,
    })),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
