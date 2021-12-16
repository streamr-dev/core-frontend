// @flow

import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Layout from '$shared/components/Layout'

import { MarketplaceHelmet } from '$shared/components/Helmet'
import type { ProductId } from '$mp/flowtype/product-types'
import usePending from '$shared/hooks/usePending'

import { getProductSubscription } from '$mp/modules/product/actions'
import PrestyledLoadingIndicator from '$shared/components/LoadingIndicator'
import Nav from '$shared/components/Layout/Nav'

import { selectUserData } from '$shared/modules/user/selectors'
import { getToken } from '$shared/utils/sessionToken'
import ProductController, { useController } from '../ProductController'
import WhitelistRequestAccessModal from './WhitelistRequestAccessModal'
import PurchaseModal from './PurchaseModal'

import Page from './Page'

const LoadingIndicator = styled(PrestyledLoadingIndicator)`
    top: 2px;
`

const ProductPage = () => {
    const dispatch = useDispatch()
    const {
        product,
        loadContractProductSubscription,
        loadCategories,
        loadProductStreams,
        loadDataUnion,
        loadRelatedProducts,
    } = useController()
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null && !!getToken()
    const { isPending } = usePending('contractProduct.LOAD')

    const { id: productId } = useParams()

    const loadAdditionalProductData = useCallback(async (id: ProductId) => {
        loadContractProductSubscription(id)
        loadCategories()
        loadProductStreams(id, isLoggedIn)
        loadRelatedProducts(id, isLoggedIn)
        if (isLoggedIn) {
            dispatch(getProductSubscription(id))
        }
    }, [
        dispatch,
        isLoggedIn,
        loadContractProductSubscription,
        loadCategories,
        loadProductStreams,
        loadRelatedProducts,
    ])

    useEffect(() => {
        loadAdditionalProductData(productId)
    }, [loadAdditionalProductData, productId])

    const { dataUnionDeployed, beneficiaryAddress } = product

    useEffect(() => {
        if (dataUnionDeployed && beneficiaryAddress) {
            loadDataUnion(beneficiaryAddress)
        }
    }, [dataUnionDeployed, beneficiaryAddress, loadDataUnion])

    return (
        <Layout nav={(<Nav shadow />)}>
            <MarketplaceHelmet title={product.name} />
            <LoadingIndicator loading={isPending} />
            <Page />
            <PurchaseModal />
            <WhitelistRequestAccessModal />
        </Layout>
    )
}

const LoadingView = () => (
    <Layout>
        <MarketplaceHelmet />
        <LoadingIndicator loading />
    </Layout>
)

const EditWrap = () => {
    const { product, hasLoaded } = useController()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!hasLoaded || loadPending || permissionsPending) {
        return <LoadingView />
    }

    const key = (!!product && product.id) || ''

    return (
        <ProductPage
            key={key}
            product={product}
        />
    )
}

const ProductContainer = () => {
    const { id } = useParams()

    return (
        <ProductController
            key={id}
            ignoreUnauthorized
            requirePublished
            useAuthorization={false}
        >
            <EditWrap />
        </ProductController>
    )
}

export default () => (
    <ProductContainer />
)
