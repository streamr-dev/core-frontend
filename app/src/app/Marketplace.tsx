import React from 'react'
import { Route as RouterRoute } from 'react-router-dom'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorPage from '$shared/components/ErrorPage'
import ProductPage from '$mp/containers/ProductPage'
import StreamPreviewPage from '$mp/containers/StreamPreviewPage'
import ProjectsPage from '$mp/containers/Projects'
import NewProductPage from '$mp/components/NewProductPage'
import routes from '$routes'
const Route = withErrorBoundary(ErrorPage)(RouterRoute)

const MarketplaceRouter = () => [
    <Route exact path={routes.marketplace.index()} component={ProjectsPage} key="Projects" />,
    <Route exact path={routes.marketplace.streamPreview()} component={StreamPreviewPage} key="StreamPreview" />,
    <Route exact path={routes.marketplace.product()} component={ProductPage} key="ProductPage2" />,
    <Route exact path={routes.products.new()} component={NewProductPage} key="NewProductPage" />,
]

export default MarketplaceRouter
