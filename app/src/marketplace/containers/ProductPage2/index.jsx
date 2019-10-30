// @flow

import React, { useEffect, useCallback, useContext, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import { I18n } from 'react-redux-i18n'
import { Helmet } from 'react-helmet'
import { withRouter } from 'react-router-dom'

import Layout from '$shared/components/Layout'
import { formatPath } from '$shared/utils/url'
import type { ProductId } from '$mp/flowtype/product-types'
import { productStates } from '$shared/utils/constants'
import * as RouterContext from '$shared/components/RouterContextProvider'
import ProductController from '../ProductController'

import { getProductSubscription, getUserProductPermissions } from '$mp/modules/product/actions'
import BackButton from '$shared/components/BackButton'
import { getAdminFee, getJoinPartStreamId } from '$mp/modules/communityProduct/services'
import { getSubscriberCount, getMostRecentPurchase } from '$mp/modules/contractProduct/services'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import { Provider as ModalProvider } from '$shared/components/ModalContextProvider'
import useModal from '$shared/hooks/useModal'

import { getRelatedProducts } from '../../modules/relatedProducts/actions'
import { isCommunityProduct } from '../../utils/product'
import PurchaseModal from './PurchaseModal'

import Page from './Page'
import styles from './page.pcss'

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
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import links from '$mp/../links'
import routes from '$routes'
import { selectRelatedProductList } from '$mp/modules/relatedProducts/selectors'

const ProductPage = () => {
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
    const authApiKeyId = useSelector(selectAuthApiKeyId)
    const [adminFee, setAdminFee] = useState(null)
    const [joinPartStreamId, setJoinPartStreamId] = useState(null)
    const [subscriberCount, setSubscriberCount] = useState(null)
    const [recentPurchaseTimestamp, setRecentPurchaseTimestamp] = useState(null)

    const { match } = useContext(RouterContext.Context)

    const noHistoryRedirect = useCallback((...params) => {
        dispatch(replace(formatPath(...params)))
    }, [dispatch])

    const toolbarActions = {}
    if (product && editPermission) {
        toolbarActions.edit = {
            title: I18n.t('editProductPage.edit'),
            linkTo: routes.editProduct({
                id: product.id,
            }),
        }
    }

    const loadProduct = useCallback(async (id: ProductId) => {
        dispatch(getUserProductPermissions(id))
        dispatch(getRelatedProducts(id))
        if (isLoggedIn) {
            dispatch(getProductSubscription(id))
        }
    }, [dispatch, isLoggedIn])

    const loadCPData = useCallback(async (p) => {
        if (isCommunityProduct(p) && p.beneficiaryAddress) {
            setAdminFee(await getAdminFee(p.beneficiaryAddress))
            setJoinPartStreamId(await getJoinPartStreamId(p.beneficiaryAddress))
        }
    }, [])

    const loadBlockchainData = useCallback(async (p) => {
        setSubscriberCount(await getSubscriberCount(p.id))
        setRecentPurchaseTimestamp(await getMostRecentPurchase(p.id))
    }, [])

    const { api: purchaseDialog } = useModal('purchase')

    const onPurchase = useCallback(async (id: ProductId) => {
        if (isLoggedIn) {
            await purchaseDialog.open({
                productId: id,
            })
        } else {
            dispatch(replace(routes.login({
                redirect: routes.product({
                    id,
                }),
            })))
        }
    }, [dispatch, isLoggedIn, purchaseDialog])

    useEffect(() => {
        loadProduct(match.params.id)
    }, [loadProduct, match.params.id])

    useEffect(() => {
        loadBlockchainData(product)
        loadCPData(product)
    }, [product, loadCPData, loadBlockchainData])

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
                authApiKeyId={authApiKeyId}
                adminFee={adminFee}
                joinPartStreamId={joinPartStreamId}
                subscriberCount={subscriberCount}
                mostRecentPurchaseTimestamp={recentPurchaseTimestamp}
            />
            <PurchaseModal />
        </Layout>
    )
}

const LoadingView = () => (
    <Layout>
        <LoadingIndicator loading className={styles.loadingIndicator} />
    </Layout>
)

const EditWrap = () => {
    const product = useSelector(selectProduct)

    if (!product) {
        return <LoadingView />
    }

    const key = (!!product && product.id) || ''

    return (
        <ModalProvider key={key}>
            <ProductPage
                product={product}
            />
        </ModalProvider>
    )
}

const ProductContainer = withRouter((props) => (
    <ProductController key={props.match.params.id}>
        <EditWrap />
    </ProductController>
))

export default () => (
    <ProductContainer />
)
