// @flow

import React, { useEffect, useCallback, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Layout from '$shared/components/Layout'

import { MarketplaceHelmet } from '$shared/components/Helmet'
import type { ProductId } from '$mp/flowtype/product-types'
import * as RouterContext from '$shared/contexts/Router'
import ProductController, { useController } from '../ProductController'
import usePending from '$shared/hooks/usePending'

import { getProductSubscription } from '$mp/modules/product/actions'
import PrestyledLoadingIndicator from '$shared/components/LoadingIndicator'
import { WhitelistRequestAccessModal } from '$mp/containers/EditProductPage/WhitelistModals'

import PurchaseModal from './PurchaseModal'
import useProduct from '$mp/containers/ProductController/useProduct'
import { selectUserData } from '$shared/modules/user/selectors'
import { getToken } from '$shared/utils/sessionToken'

import Page from './Page'

const LoadingIndicator = styled(PrestyledLoadingIndicator)`
    top: 2px;
`

const theme = {
    navShadow: true,
}

const ProductPage = () => {
    const dispatch = useDispatch()
    const {
        loadContractProductSubscription,
        loadCategories,
        loadProductStreams,
        loadDataUnion,
        loadRelatedProducts,
    } = useController()
    const product = useProduct()
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null && !!getToken()
    const { isPending } = usePending('contractProduct.LOAD')

    const { match } = useContext(RouterContext.Context)

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
        loadAdditionalProductData(match.params.id)
    }, [loadAdditionalProductData, match.params.id])

    const { dataUnionDeployed, beneficiaryAddress } = product

    useEffect(() => {
        if (dataUnionDeployed && beneficiaryAddress) {
            loadDataUnion(beneficiaryAddress)
        }
    }, [dataUnionDeployed, beneficiaryAddress, loadDataUnion])

    return (
        <Layout theme={theme}>
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
    const product = useProduct()
    const { hasLoaded } = useController()
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

const ProductContainer = withRouter((props) => (
    <ProductController key={props.match.params.id} ignoreUnauthorized requirePublished>
        <EditWrap />
    </ProductController>
))

export default () => (
    <ProductContainer />
)
