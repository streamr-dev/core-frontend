// @flow

import React from 'react'
import { Route as RouterRoute } from 'react-router-dom'

import { userIsAuthenticated } from '$auth/utils/userAuthenticated'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import routes from '$routes'
import links from '../links'
import { formatPath } from '$shared/utils/url'

import ErrorPage from '$shared/components/ErrorPage'

import ProductPage from '$mp/containers/deprecated/ProductPage'
import ProductPage2 from '$mp/containers/ProductPage'
import StreamPreviewPage from '$mp/containers/StreamPreviewPage'
import EditProductPage from '$mp/containers/deprecated/EditProductPage'
import Products from '$mp/containers/Products'
import NewProductPage from '$mp/components/NewProductPage'

const Route = withErrorBoundary(ErrorPage)(RouterRoute)

const CreateProductAuth = userIsAuthenticated(EditProductPage)
const EditProductAuth = userIsAuthenticated(EditProductPage)

// Other components
const ProductPurchasePage = (props) => <ProductPage overlayPurchaseDialog {...props} />
const ProductPublishPage = (props) => <ProductPage overlayPublishDialog {...props} />

const { marketplace } = links

const MarketplaceRouter = () => (process.env.NEW_MP_CONTRACT ? [
    <Route exact path={marketplace.main} component={Products} key="Products" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'streamPreview', ':streamId')} component={StreamPreviewPage} key="StreamPreview" />,
    <Route exact path={formatPath(marketplace.products, ':id')} component={ProductPage2} key="ProductPage2" />,
    <Route exact path={routes.newProduct()} component={NewProductPage} key="NewProductPage" />,
] : [
    <Route exact path={marketplace.main} component={Products} key="Products" />,
    <Route exact path={links.marketplace.createProduct} component={CreateProductAuth} key="CreateProduct" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'purchase')} component={ProductPurchasePage} key="ProductPurchasePage" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'publish')} component={ProductPublishPage} key="ProductPublishPage" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'streamPreview', ':streamId')} component={StreamPreviewPage} key="StreamPreview" />,
    <Route exact path={formatPath(marketplace.products, ':id')} component={ProductPage} key="ProductPage" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'edit')} component={EditProductAuth} key="EditProduct" />,
])

export default MarketplaceRouter
