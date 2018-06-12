// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'
import { push } from 'react-router-redux'

import ProductPageComponent from '../../components/ProductPage'
import { formatPath } from '../../utils/url'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { StreamId, StreamList } from '../../flowtype/stream-types'
import { productStates } from '../../utils/constants'

import { getProductById, getProductSubscription, purchaseProduct } from '../../modules/product/actions'
import { getRelatedProducts } from '../../modules/relatedProducts/actions'
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
    selectUserData,
    selectProductEditPermission,
    selectProductPublishPermission,
    selectFetchingProductSharePermission,
} from '../../modules/user/selectors'
import links from '../../links'
import { selectRelatedProductList } from '../../modules/relatedProducts/selectors'

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
    fetchingSharePermission: boolean,
    relatedProducts: Array<Product>,
}

export type DispatchProps = {
    getProductById: (ProductId: ProductId) => void,
    getProductSubscription: (ProductId: ProductId) => void,
    getUserProductPermissions: (ProductId: ProductId) => void,
    onPurchase: (ProductId: ProductId, boolean) => void,
    showPurchaseDialog: (Product: Product) => void,
    showPublishDialog: (Product: Product) => void,
    showStreamLiveDataDialog: (StreamId: StreamId) => void,
    getRelatedProducts: (ProductId) => any,
    deniedRedirect: (ProductId) => void,
}

type Props = OwnProps & StateProps & DispatchProps

class ProductPage extends Component<Props> {
    componentDidMount() {
        this.getProduct(this.props.match.params.id)
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
            isProductSubscriptionValid,
            publishPermission,
            fetchingSharePermission,
            deniedRedirect,
        } = nextProps

        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.getProduct(nextProps.match.params.id)
        }

        // Fetch subscription on hard load if logged in (initial state is false)
        if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
            this.props.getProductSubscription(this.props.match.params.id)
        }

        if (!product) {
            return
        }

        if (overlayPurchaseDialog) {
            // Prevent access to purchase dialog on direct route
            if (!this.getPurchaseAllowed(product, isProductSubscriptionValid)) {
                deniedRedirect(product.id || '0')
            } else {
                showPurchaseDialog(product)
            }
        } else if (overlayPublishDialog) {
            // Prevent access to publish dialog on direct route
            if (!fetchingSharePermission && !publishPermission) {
                deniedRedirect(product.id || '0')
            } else {
                showPublishDialog(product)
            }
        } else if (overlayStreamLiveDataDialog) {
            showStreamLiveDataDialog(streamId)
        }
    }

    getProduct = (id) => {
        this.props.getProductById(id)
        this.props.getUserProductPermissions(id)
        this.props.getRelatedProducts(id)
        if (this.props.isLoggedIn) {
            this.props.getProductSubscription(id)
        }
    }

    getPurchaseAllowed = (product: Product, isProductSubscriptionValid) =>
        !((!isPaidProduct(product) && isProductSubscriptionValid) || product.state !== productStates.DEPLOYED)

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
            relatedProducts,
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
                className: 'hidden-xs-down',
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
                    showStreamActions={product.state === productStates.DEPLOYED}
                    isLoggedIn={isLoggedIn}
                    relatedProducts={relatedProducts}
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
    relatedProducts: selectRelatedProductList(state),
    fetchingProduct: selectFetchingProduct(state),
    fetchingStreams: selectFetchingStreams(state),
    isLoggedIn: selectUserData(state) !== null,
    editPermission: selectProductEditPermission(state),
    publishPermission: selectProductPublishPermission(state),
    isProductSubscriptionValid: selectSubscriptionIsValid(state),
    fetchingSharePermission: selectFetchingProductSharePermission(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    getProductSubscription: (id: ProductId) => dispatch(getProductSubscription(id)),
    getUserProductPermissions: (id: ProductId) => dispatch(getUserProductPermissions(id)),
    deniedRedirect: (id: ProductId) => dispatch(push(formatPath(links.products, id))),
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
        redirectOnCancel: true,
        productId: product.id || '',
        requireOwnerIfDeployed: true,
        requireWeb3: isPaidProduct(product),
    })),
    showStreamLiveDataDialog: (streamId: StreamId) => dispatch(showModal(STREAM_LIVE_DATA, {
        ...ownProps,
        streamId,
    })),
    getRelatedProducts: getRelatedProducts(dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
