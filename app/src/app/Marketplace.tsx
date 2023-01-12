import React, { FunctionComponent, ReactNode } from 'react'
import { Redirect, Route as RouterRoute, useParams } from 'react-router-dom'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorPage from '$shared/components/ErrorPage'
import ProjectPage from '$mp/containers/ProjectPage'
import StreamPreviewPage from '$mp/containers/StreamPreviewPage'
import ProjectsPage from '$mp/containers/Projects'
import ProjectConnectPage from '$mp/containers/ProjectPage/ProjectConnectPage'
import ProjectLiveDataPage from '$mp/containers/ProjectPage/ProjectLiveDataPage'
import NewProductPage from '$mp/components/NewProductPage'
import { userIsAuthenticated } from '$auth/utils/userAuthenticated'
import routes from '$routes'
const Route = withErrorBoundary(ErrorPage)(RouterRoute)

const NewProductPageAuth = userIsAuthenticated(NewProductPage)

const ProjectDetailsPageRedirect: FunctionComponent = () => {
    const { id } = useParams<{id: string}>()
    return <Redirect to={routes.marketplace.product.overview({id})}/>
}

const MarketplaceRouter = (): ReactNode => [
    <Route exact path={routes.marketplace.index()} component={ProjectsPage} key="Projects" />,
    <Route exact path={routes.marketplace.streamPreview()} component={StreamPreviewPage} key="StreamPreview" />,
    <Route exact path={routes.marketplace.product.overview()} component={ProjectPage} key="ProjectDetailsOverviewPage" />,
    <Route exact path={routes.marketplace.product.connect()} component={ProjectConnectPage} key="ProjectDetailsConnectPage" />,
    <Route exact path={routes.marketplace.product.liveData()} component={ProjectLiveDataPage} key="ProjectDetailsLiveDataPage" />,
    <Route exact path={routes.marketplace.product.index()} component={ProjectDetailsPageRedirect} key="ProjectDetailsPageRedirect"/>,
    <Route exact path={routes.products.new()} component={NewProductPageAuth} key="NewProductPage" />,
]

export default MarketplaceRouter
