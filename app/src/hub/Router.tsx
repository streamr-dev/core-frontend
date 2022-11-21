import React from 'react'
import { Route as RouterRoute, Redirect } from 'react-router-dom'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorPage from '$shared/components/ErrorPage'
import StreamListing from '$app/src/hub/StreamListing'
import routes from '$routes'

const Route = withErrorBoundary(ErrorPage)(RouterRoute)

const HubRouter = () => [
    <Route exact path={routes.streams.index()} component={StreamListing} key="StreamListing" />,
]

export default HubRouter
