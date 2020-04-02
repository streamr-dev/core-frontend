// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'
import { push, replace } from 'connected-react-router'
import { I18n } from 'react-redux-i18n'
import { Helmet } from 'react-helmet'

import ProductPageComponent from '$mp/components/deprecated/ProductPage'
import Layout from '$shared/components/Layout'
import { formatPath } from '$shared/utils/url'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ProductId, Product } from '$mp/flowtype/product-types'
import type { StreamList } from '$shared/flowtype/stream-types'
import { productStates } from '$shared/utils/constants'
import NotFoundPage from '$shared/components/NotFoundPage'

import PurchaseDialog from '$mp/containers/deprecated/ProductPage/PurchaseDialog'
import PublishOrUnpublishDialog from '$mp/containers/deprecated/ProductPage/PublishOrUnpublishDialog'
import { getProductById, getProductSubscription, purchaseProduct, getUserProductPermissions } from '$mp/modules/product/actions'
import { getRelatedProducts } from '$mp/modules/relatedProducts/actions'
import { isPaidProduct } from '$mp/utils/product'
import BackToProductsButton from '$shared/components/BackToProductsButton'

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
} from '$mp/modules/product/selectors'
import { selectUserData } from '$shared/modules/user/selectors'
import links from '$mp/../links'
import routes from '$routes'
import { selectRelatedProductList } from '$mp/modules/relatedProducts/selectors'

export type OwnProps = {
    match: Match,
    overlayPurchaseDialog: boolean,
    overlayPublishDialog: boolean,
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
    getRelatedProducts: (ProductId) => any,
    deniedRedirect: (ProductId) => void,
    noHistoryRedirect: (...any) => void,
    onCancelPurchase: (ProductId) => void,
}

type Props = OwnProps & StateProps & DispatchProps

export class ProductPage extends Component<Props> {
    componentDidMount() {
        this.getProduct(this.props.match.params.id)
    }

    componentWillReceiveProps(nextProps: Props) {
        const { isLoggedIn, match: { params: { id } }, getProductSubscription: getSubscription } = this.props

        if (id !== nextProps.match.params.id) {
            this.getProduct(nextProps.match.params.id)
        }

        // Fetch subscription on hard load if logged in (initial state is false)
        if (!isLoggedIn && nextProps.isLoggedIn) {
            getSubscription(id)
        }
    }

    componentDidUpdate() {
        const { product, overlayPurchaseDialog, deniedRedirect } = this.props
        if (product && overlayPurchaseDialog && !this.isPurchaseAllowed()) {
            deniedRedirect(product.id || '0')
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
        switch (product.state) {
            case productStates.DEPLOYED:
                return I18n.t('editProductPage.unpublish')
            case productStates.DEPLOYING:
                return I18n.t('editProductPage.publishing')
            case productStates.UNDEPLOYING:
                return I18n.t('editProductPage.unpublishing')
            case productStates.NOT_DEPLOYED:
            default:
                return I18n.t('editProductPage.publish')
        }
    }

    getPublishButtonDisabled = (product: Product) => (
        product.state === productStates.DEPLOYING || product.state === productStates.UNDEPLOYING
    )

    isPurchaseAllowed() {
        const { product, isProductSubscriptionValid, isLoggedIn } = this.props
        return !!product && this.getPurchaseAllowed(product, !!isProductSubscriptionValid, !!isLoggedIn)
    }

    productDetails = () => null

    overlay() {
        const { overlayPurchaseDialog, product, overlayPublishDialog, onCancelPurchase } = this.props

        if (product) {
            if (overlayPurchaseDialog) {
                if (this.isPurchaseAllowed()) {
                    return (
                        <PurchaseDialog
                            productId={product.id || ''}
                            requireInContract
                            onCancel={() => onCancelPurchase(product.id || '')}
                        />
                    )
                }
            } else if (overlayPublishDialog) {
                return (
                    <PublishOrUnpublishDialog
                        productId={product.id || ''}
                        requireOwnerIfDeployed
                        requireWeb3={isPaidProduct(product)}
                    />
                )
            }
        }

        return null
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
                title: I18n.t('editProductPage.edit'),
                linkTo: formatPath(links.marketplace.products, product.id || '', 'edit'),
            }
        }

        if (product) {
            toolbarActions.publish = {
                title: this.getPublishButtonTitle(product),
                disabled: this.getPublishButtonDisabled(product),
                kind: 'primary',
                onClick: () => noHistoryRedirect(links.marketplace.products, product.id || '', 'publish'),
                className: 'd-none d-sm-inline-block',
            }
        }

        return !!product && (
            <Layout>
                <Helmet title={`${product.name} | ${I18n.t('general.title.suffix')}`} />
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
                    toolbarStatus={<BackToProductsButton />}
                    showStreamLiveDataDialog={(streamId) => noHistoryRedirect(links.marketplace.products, product.id, 'streamPreview', streamId)}
                />
                {this.overlay()}
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

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    getProductSubscription: (id: ProductId) => dispatch(getProductSubscription(id)),
    getUserProductPermissions: (id: ProductId) => dispatch(getUserProductPermissions(id)),
    deniedRedirect: (id: ProductId) => dispatch(push(formatPath(links.marketplace.products, id))),
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
    getRelatedProducts: (id: ProductId) => dispatch(getRelatedProducts(id)),
    noHistoryRedirect: (...params) => dispatch(replace(formatPath(...params))),
    onCancelPurchase: (id: ProductId) => dispatch(replace(formatPath(links.marketplace.products, id))),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
