// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'
import { goBack, push, replace } from 'react-router-redux'

import ProductPageComponent from '../../components/ProductPage'
import Layout from '../../components/Layout'
import { formatPath } from '$shared/utils/url'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { StreamId, StreamList } from '$shared/flowtype/stream-types'
import { productStates } from '../../utils/constants'
import { hasKnownHistory } from '../../utils/history'
import withI18n from '../WithI18n'
import NotFoundPage from '../../components/NotFoundPage'

import { getProductById, getProductSubscription, purchaseProduct, getUserProductPermissions } from '../../modules/product/actions'
import { getRelatedProducts } from '../../modules/relatedProducts/actions'
import { PURCHASE, PUBLISH, STREAM_LIVE_DATA } from '../../utils/modals'
import { showModal } from '../../modules/modals/actions'
import { isPaidProduct } from '../../utils/product'
import BackButton from '../../components/Buttons/Back'

import {
    selectFetchingProduct,
    selectProduct,
    selectStreams,
    selectFetchingStreams,
    selectSubscriptionIsValid,
    selectProductError,
    selectProductEditPermission,
    selectProductPublishPermission,
    selectFetchingProductSharePermission,
} from '../../modules/product/selectors'
import { selectUserData } from '$shared/modules/user/selectors'
import links from '../../../links'
import routes from '$routes'
import { selectRelatedProductList } from '../../modules/relatedProducts/selectors'

export type OwnProps = {
    match: Match,
    overlayPurchaseDialog: boolean,
    overlayPublishDialog: boolean,
    overlayStreamLiveDataDialog: boolean,
    translate: (key: string, options: any) => string,
}

export type StateProps = {
    fetchingProduct: boolean,
    product: ?Product,
    productError: any,
    fetchingStreams: boolean,
    streams: StreamList,
    fetchingProduct: boolean,
    isLoggedIn?: boolean,
    isProductSubscriptionValid?: boolean,
    editPermission: boolean,
    relatedProducts: Array<Product>,
}

export type DispatchProps = {
    getProductById: (ProductId: ProductId) => void,
    getProductSubscription: (ProductId: ProductId) => void,
    getUserProductPermissions: (ProductId: ProductId) => void,
    onPurchase: (ProductId: ProductId, boolean) => void,
    showPurchaseDialog: (Product: Product) => void,
    showPublishDialog: (Product: Product) => void,
    getRelatedProducts: (ProductId) => any,
    deniedRedirect: (ProductId) => void,
    goBrowserBack: () => void,
    noHistoryRedirect: (...any) => void,
    showStreamLiveDataDialog: (streamId: StreamId) => void,
}

type Props = OwnProps & StateProps & DispatchProps

type State = {
    truncated: boolean,
    truncationRequired: boolean,
    userTruncated: boolean,
}

export class ProductPage extends Component<Props, State> {
    state = {
        truncated: false,
        truncationRequired: false,
        userTruncated: false,
    }

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
            deniedRedirect,
            isLoggedIn,
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
            if (this.getPurchaseAllowed(product, !!isProductSubscriptionValid, !!isLoggedIn)) {
                showPurchaseDialog(product)
            } else {
                deniedRedirect(product.id || '0')
            }
        } else if (overlayPublishDialog) {
            showPublishDialog(product)
        } else if (overlayStreamLiveDataDialog) {
            showStreamLiveDataDialog(streamId)
        }

        if (!this.state.userTruncated) {
            this.initTruncateState(product.description)
        }
    }

    getProduct = (id: ProductId) => {
        this.props.getProductById(id)
        this.props.getUserProductPermissions(id)
        this.props.getRelatedProducts(id)
        if (this.props.isLoggedIn) {
            this.props.getProductSubscription(id)
        }
    }

    getPurchaseAllowed = (product: Product, isProductSubscriptionValid: boolean, isLoggedIn: boolean) => (
        (isPaidProduct(product) || !isProductSubscriptionValid) &&
        product.state === productStates.DEPLOYED &&
        isLoggedIn
    )

    getPublishButtonTitle = (product: Product) => {
        const { translate } = this.props

        switch (product.state) {
            case productStates.DEPLOYED:
                return translate('editProductPage.unpublish')
            case productStates.DEPLOYING:
                return translate('editProductPage.publishing')
            case productStates.UNDEPLOYING:
                return translate('editProductPage.unpublishing')
            case productStates.NOT_DEPLOYED:
            default:
                return translate('editProductPage.publish')
        }
    }

    getPublishButtonDisabled = (product: Product) => {
        if (product.state === productStates.DEPLOYING ||
            product.state === productStates.UNDEPLOYING) {
            return true
        }
        return false
    }

    setTruncateState = () => {
        if (this.state.truncated) {
            this.setState({
                truncated: false,
                userTruncated: true,
            })
        } else {
            this.setState({
                truncated: true,
                userTruncated: true,
            })

            if (this.productDetails) {
                this.productDetails.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest',
                })
            }
        }
    }

    productDetails = () => null

    initTruncateState = (text: string) => {
        if (typeof text !== 'undefined') {
            this.setState({
                truncationRequired: !(text.length < 400),
                truncated: !(text.length < 400),
            })
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
            onPurchase,
            relatedProducts,
            translate,
            goBrowserBack,
            noHistoryRedirect,
            productError,
        } = this.props

        if (productError && productError.statusCode === 404) {
            return <NotFoundPage />
        }

        if (productError && productError.message && productError.message.includes('is not valid hex string')) {
            return <NotFoundPage />
        }

        const toolbarActions = {}
        if (product && editPermission) {
            toolbarActions.edit = {
                title: translate('editProductPage.edit'),
                linkTo: formatPath(links.products, product.id || '', 'edit'),
            }
        }

        if (product) {
            toolbarActions.publish = {
                title: this.getPublishButtonTitle(product),
                disabled: this.getPublishButtonDisabled(product),
                color: 'primary',
                onClick: () => noHistoryRedirect(links.products, product.id || '', 'publish'),
                className: 'hidden-xs-down',
            }
        }

        return !!product && (
            <Layout>
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
                    toolbarStatus={<BackButton onClick={() => goBrowserBack()} />}
                    setTruncateState={this.setTruncateState}
                    truncateState={this.state.truncated}
                    truncationRequired={this.state.truncationRequired}
                    productDetailsRef={(c) => { this.productDetails = c }}
                    showStreamLiveDataDialog={(streamId) => noHistoryRedirect(links.products, product.id, 'streamPreview', streamId)}
                />
            </Layout>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    productError: selectProductError(state),
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

export const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    goBrowserBack: () => {
        if (hasKnownHistory()) {
            return dispatch(goBack())
        }
        return dispatch(push(formatPath(links.main)))
    },
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    getProductSubscription: (id: ProductId) => dispatch(getProductSubscription(id)),
    getUserProductPermissions: (id: ProductId) => dispatch(getUserProductPermissions(id)),
    deniedRedirect: (id: ProductId) => dispatch(push(formatPath(links.products, id))),
    onPurchase: (id: ProductId, isLoggedIn: boolean) => {
        if (isLoggedIn) {
            dispatch(purchaseProduct())
        } else {
            dispatch(replace(routes.login({
                redirect: routes.product({
                    id,
                }),
            })))
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
    getRelatedProducts: (id: ProductId) => dispatch(getRelatedProducts(id)),
    noHistoryRedirect: (...params) => dispatch(replace(formatPath(...params))),
})

export default connect(mapStateToProps, mapDispatchToProps)(withI18n(ProductPage))
