import React from 'react'
import { Router, Route as RouterRoute, Switch, Redirect } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import '$shared/assets/stylesheets'
import '@ibm/plex/css/ibm-plex.css'
import '$utils/setupSnippets'

// Auth
import StreamrClientProvider from '$shared/components/StreamrClientProvider'
import LoginPage from '$app/src/pages/LoginPage'
import LogoutPage from '$app/src/pages/LogoutPage'
import { Provider as ModalPortalProvider } from '$shared/contexts/ModalPortal'
import { Provider as ModalProvider } from '$shared/contexts/ModalApi'
import Notifications from '$shared/components/Notifications'
import ActivityResourceProvider from '$shared/components/ActivityList/ActivityResourceProvider'
import NotFoundPage from '$shared/components/NotFoundPage'
import AnalyticsTracker from '$shared/components/AnalyticsTracker'
import GenericErrorPage from '$shared/components/GenericErrorPage'
import ErrorPage from '$shared/components/ErrorPage'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import Analytics from '$shared/utils/Analytics'
import GlobalInfoWatcher from '$mp/containers/GlobalInfoWatcher'
import NewStreamListingPage from '$app/src/pages/NewStreamListingPage'
import StreamLiveDataPage from '$app/src/pages/StreamLiveDataPage'
import StreamConnectPage from '$app/src/pages/StreamConnectPage'
import StreamEditPage from '$app/src/pages/StreamEditPage'
import { AuthenticationControllerContextProvider } from '$auth/authenticationController'

import routes from '$routes'
import history from '../history'
import '../analytics'

// Userpages
import UserpagesRouter from './Userpages'

// Docs
import DocsRouter from './Docs'
import MarketplaceRouter from './Marketplace'

// Create client for 'react-query'
const queryClient = new QueryClient()

// Wrap authenticated components here instead of render() method
// Wrap each Route to an ErrorBoundary
const Route = withErrorBoundary(ErrorPage)(RouterRoute)

const AuthenticationRouter = () => [
    <Route exact path={routes.auth.login()} component={LoginPage} key="LoginPage" />,
    <Route exact path={routes.auth.logout()} component={LogoutPage} key="LogoutPage" />, // Redirect old paths to login
    <Redirect from="/login/auth" to={routes.auth.login()} key="LoginRedirect" />,
    <Redirect from="/signup" to={routes.auth.login()} key="SignUpRedirect" />,
    <Redirect from="/forgotPassword" to={routes.auth.login()} key="ForgotPasswordRedirect" />,
    <Redirect from="/resetPassword" to={routes.auth.login()} key="ResetPasswordRedirect" />,
    <Redirect from="/register" to={routes.auth.login()} key="RegisterRedirect" />,
    <Redirect from="/register/register" to={routes.auth.login()} key="LegacyRegisterRedirect" />,
    <Redirect from="/register/resetPassword" to={routes.auth.login()} key="LegacyResetPasswordRedirect" />,
    <Redirect from="/register/forgotPassword" to={routes.auth.login()} key="LegacyForgotPasswordRedirect" />,
]

const MiscRouter = () => [
    <Route exact path="/error" component={GenericErrorPage} key="GenericErrorPage" />,
    <Route component={NotFoundPage} key="NotFoundPage" />,
]

const HubRouter = () => [
    <Route exact path={routes.streams.index()} component={NewStreamListingPage} key="NewStreamListingPage" />,
    <Route exact path={routes.streams.show()} component={StreamEditPage} key="StreamDetailsOverviewPage" />,
    <Route exact path={routes.streams.connect()} component={StreamConnectPage} key="StreamDetailsConnectPage" />,
    <Route exact path={routes.streams.liveData()} component={StreamLiveDataPage} key="StreamDetailsLiveDataPage" />,
    <Redirect from={routes.root()} to={routes.streams.index()} key="RootRedirect" />, // edge case for localhost
    <Redirect from={routes.core()} to={routes.streams.index()} key="StreamListViewRedirect" />,
]

const App = () => (
    <Router history={history}>
        <QueryClientProvider client={queryClient}>
            <AuthenticationControllerContextProvider>
                <StreamrClientProvider>
                    <ModalPortalProvider>
                        <ModalProvider>
                            <GlobalInfoWatcher>
                                <ActivityResourceProvider>
                                    <Analytics />
                                    <Switch>
                                        {AuthenticationRouter()}
                                        {MarketplaceRouter()}
                                        {DocsRouter()}
                                        {UserpagesRouter()}
                                        {HubRouter()}
                                        {MiscRouter()}
                                    </Switch>
                                    <Notifications />
                                </ActivityResourceProvider>
                                <AnalyticsTracker />
                            </GlobalInfoWatcher>
                        </ModalProvider>
                    </ModalPortalProvider>
                </StreamrClientProvider>
            </AuthenticationControllerContextProvider>
        </QueryClientProvider>
    </Router>
)

export default App
