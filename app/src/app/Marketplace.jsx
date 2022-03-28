// @flow

import React from 'react'
import { Route as RouterRoute } from 'react-router-dom'

import withErrorBoundary from '$shared/utils/withErrorBoundary'

import ErrorPage from '$shared/components/ErrorPage'

import ProductPage from '$mp/containers/ProductPage'
import StreamPreviewPage from '$mp/containers/StreamPreviewPage'
import Products from '$mp/containers/Products'
import ComingSoon from '$mp/components/ComingSoon'
import NewProductPage from '$mp/components/NewProductPage'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import routes from '$routes'

const Route = withErrorBoundary(ErrorPage)(RouterRoute)
const ProductList = getCoreConfig().marketplaceDisabled ? ComingSoon : Products

const MarketplaceRouter = () => ([
    <Route exact path={routes.marketplace.index()} component={ProductList} key="Products" />,
    <Route exact path={routes.marketplace.streamPreview()} component={StreamPreviewPage} key="StreamPreview" />,
    <Route exact path={routes.marketplace.product()} component={ProductPage} key="ProductPage2" />,
    <Route exact path={routes.products.new()} component={NewProductPage} key="NewProductPage" />,
])

export default MarketplaceRouter
