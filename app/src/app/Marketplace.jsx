// @flow

import React from 'react'
import { Route as RouterRoute } from 'react-router-dom'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import routes from '$routes'
import links from '../links'
import { formatPath } from '$shared/utils/url'

import ErrorPage from '$shared/components/ErrorPage'

import ProductPage from '$mp/containers/ProductPage'
import StreamPreviewPage from '$mp/containers/StreamPreviewPage'
import Products from '$mp/containers/Products'
import NewProductPage from '$mp/components/NewProductPage'

const Route = withErrorBoundary(ErrorPage)(RouterRoute)

const { marketplace } = links

const MarketplaceRouter = () => ([
    <Route exact path={marketplace.main} component={Products} key="Products" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'streamPreview', ':streamId')} component={StreamPreviewPage} key="StreamPreview" />,
    <Route exact path={formatPath(marketplace.products, ':id')} component={ProductPage} key="ProductPage2" />,
    <Route exact path={routes.newProduct()} component={NewProductPage} key="NewProductPage" />,
])

export default MarketplaceRouter
