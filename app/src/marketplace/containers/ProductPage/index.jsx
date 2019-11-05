// @flow

import React, { useEffect, useCallback, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { Helmet } from 'react-helmet'
import { withRouter } from 'react-router-dom'

import Layout from '$shared/components/Layout'
import type { ProductId, CommunityId } from '$mp/flowtype/product-types'
import * as RouterContext from '$shared/components/RouterContextProvider'
import ProductController, { useController } from '../ProductController'
import usePending from '$shared/hooks/usePending'

import { getProductSubscription } from '$mp/modules/product/actions'
import BackButton from '$shared/components/BackButton'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import { Provider as ModalProvider } from '$shared/components/ModalContextProvider'

import { getRelatedProducts } from '../../modules/relatedProducts/actions'
import PurchaseModal from './PurchaseModal'
import Toolbar from '$shared/components/Toolbar'
import useProduct from '$mp/containers/ProductController/useProduct'
import useProductPermissions from '$mp/containers/ProductController/useProductPermissions'
import { selectUserData } from '$shared/modules/user/selectors'
import routes from '$routes'

import Page from './Page'
import styles from './page.pcss'

const ProductPage = () => {
    const dispatch = useDispatch()
    const { loadContractProductSubscription, loadCategories, loadProductStreams, loadCommunityProduct } = useController()
    const product = useProduct()
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const { write, share } = useProductPermissions()
    const canEdit = !!(write || share)

    const { match } = useContext(RouterContext.Context)

    const toolbarActions = {}
    if (product && canEdit) {
        toolbarActions.edit = {
            title: I18n.t('editProductPage.edit'),
            linkTo: routes.editProduct({
                id: product.id,
            }),
        }
    }

    const loadProduct = useCallback(async (id: ProductId) => {
        dispatch(getRelatedProducts(id))
        loadContractProductSubscription(id)
        loadCategories()
        loadProductStreams(id)
        if (isLoggedIn) {
            dispatch(getProductSubscription(id))
        }
    }, [dispatch, isLoggedIn, loadContractProductSubscription, loadCategories, loadProductStreams])

    const loadCommunity = useCallback(async (id: CommunityId) => {
        loadCommunityProduct(id)
    }, [loadCommunityProduct])

    useEffect(() => {
        loadProduct(match.params.id)
    }, [loadProduct, match.params.id])

    const { communityDeployed, beneficiaryAddress } = product

    useEffect(() => {
        if (communityDeployed && beneficiaryAddress) {
            loadCommunity(beneficiaryAddress)
        }
    }, [communityDeployed, beneficiaryAddress, loadCommunity])

    return (
        <Layout hideNavOnDesktop={canEdit} navShadow>
            <Helmet title={`${product.name} | ${I18n.t('general.title.suffix')}`} />
            {canEdit && (
                <Toolbar
                    className={Toolbar.styles.shadow}
                    left={<BackButton />}
                    actions={toolbarActions}
                />
            )}
            <Page />
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
    const product = useProduct()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!product || loadPending || permissionsPending) {
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
