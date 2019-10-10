// @flow

import React, { useEffect, useCallback, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { push, replace } from 'connected-react-router'
import { I18n } from 'react-redux-i18n'
import { Helmet } from 'react-helmet'

import Layout from '$shared/components/Layout'
import { formatPath } from '$shared/utils/url'
import type { ProductId } from '$mp/flowtype/product-types'
import { productStates } from '$shared/utils/constants'
import * as RouterContext from '$shared/components/RouterContextProvider'

import PurchaseDialog from '$mp/containers/ProductPage/PurchaseDialog'
import PublishOrUnpublishDialog from '$mp/containers/ProductPage/PublishOrUnpublishDialog'
import { getProductById, getProductSubscription, purchaseProduct, getUserProductPermissions } from '$mp/modules/product/actions'
import BackButton from '$shared/components/BackButton'

import { getRelatedProducts } from '../../modules/relatedProducts/actions'
import { isPaidProduct } from '../../utils/product'
import Page from './Page'

import {
    selectFetchingProduct,
    selectProduct,
    selectStreams,
    selectFetchingStreams,
    selectSubscriptionIsValid,
    selectProductEditPermission,
    selectContractSubscription,
} from '$mp/modules/product/selectors'
import { selectUserData } from '$shared/modules/user/selectors'
import links from '$mp/../links'
import routes from '$routes'
import { selectRelatedProductList } from '$mp/modules/relatedProducts/selectors'

export type Props = {
    overlayPurchaseDialog?: boolean,
    overlayPublishDialog?: boolean,
}

const ProductPage = ({ overlayPurchaseDialog, overlayPublishDialog }: Props) => {
    const dispatch = useDispatch()
    const product = useSelector(selectProduct)
    const streams = useSelector(selectStreams)
    const relatedProducts = useSelector(selectRelatedProductList)
    const fetchingProduct = useSelector(selectFetchingProduct)
    const fetchingStreams = useSelector(selectFetchingStreams)
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const editPermission = useSelector(selectProductEditPermission)
    const isProductSubscriptionValid = useSelector(selectSubscriptionIsValid)
    const subscription = useSelector(selectContractSubscription)

    const { match } = useContext(RouterContext.Context)

    const getPublishButtonTitle = () => {
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

    const getPublishButtonDisabled = () => (
        product.state === productStates.DEPLOYING || product.state === productStates.UNDEPLOYING
    )

    const noHistoryRedirect = useCallback((...params) => {
        dispatch(replace(formatPath(...params)))
    }, [dispatch])

    const toolbarActions = {}
    if (product && editPermission) {
        toolbarActions.edit = {
            title: I18n.t('editProductPage.edit'),
            linkTo: routes.editProduct2({
                id: product.id,
            }),
        }
    }

    if (product) {
        toolbarActions.publish = {
            title: getPublishButtonTitle(),
            disabled: getPublishButtonDisabled(),
            color: 'primary',
            onClick: () => noHistoryRedirect(links.marketplace.products, product.id || '', 'publish2'),
            className: 'd-none d-sm-inline-block',
        }
    }

    const loadProduct = useCallback((id: ProductId) => {
        dispatch(getProductById(id))
        dispatch(getUserProductPermissions(id))
        dispatch(getRelatedProducts(id))
        if (isLoggedIn) {
            dispatch(getProductSubscription(id))
        }
    }, [dispatch, isLoggedIn])

    const onPurchase = useCallback((id: ProductId) => {
        if (isLoggedIn) {
            dispatch(purchaseProduct())
        } else {
            dispatch(replace(routes.login({
                redirect: routes.product({
                    id,
                }),
            })))
        }
    }, [dispatch, isLoggedIn])

    const deniedRedirect = useCallback((id: ProductId) => {
        dispatch(push(formatPath(links.marketplace.products, id)))
    }, [dispatch])

    const getPurchaseAllowed = useCallback(() => (
        (isPaidProduct(product) || !isProductSubscriptionValid) &&
        product.state === productStates.DEPLOYED &&
        isLoggedIn
    ), [isLoggedIn, isProductSubscriptionValid, product])

    const isPurchaseAllowed = useCallback(() => (
        !!product && getPurchaseAllowed()
    ), [product, getPurchaseAllowed])

    useEffect(() => {
        loadProduct(match.params.id)
    }, [loadProduct, match.params.id])

    useEffect(() => {
        if (product && overlayPurchaseDialog && !isPurchaseAllowed()) {
            deniedRedirect(product.id || '0')
        }
    }, [product, overlayPurchaseDialog, isPurchaseAllowed, deniedRedirect])

    const overlay = () => {
        if (product) {
            if (overlayPurchaseDialog) {
                if (isPurchaseAllowed()) {
                    return (
                        <PurchaseDialog
                            productId={product.id || ''}
                            requireInContract
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

    if (!product) {
        return null
    }

    return (
        <Layout>
            <Helmet title={`${product.name} | ${I18n.t('general.title.suffix')}`} />
            <Page
                product={product}
                streams={streams}
                fetchingStreams={fetchingProduct || fetchingStreams}
                showToolbar={editPermission}
                toolbarActions={toolbarActions}
                showStreamActions={product.state === productStates.DEPLOYED}
                isLoggedIn={isLoggedIn}
                relatedProducts={relatedProducts}
                isProductSubscriptionValid={isProductSubscriptionValid}
                productSubscription={subscription}
                onPurchase={() => onPurchase(product.id || '')}
                toolbarStatus={<BackButton />}
                showStreamLiveDataDialog={(streamId) => noHistoryRedirect(links.marketplace.products, product.id, 'streamPreview', streamId)}
            />
            {overlay()}
        </Layout>
    )
}

export default () => (
    <RouterContext.Provider>
        <ProductPage />
    </RouterContext.Provider>
)
