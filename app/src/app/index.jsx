// @flow

import React from 'react'
import { Router, Route as RouterRoute, Switch, Redirect } from 'react-router-dom'

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
import routes from '$routes'

import history from '../history'
import '../analytics'

// Userpages
import UserpagesRouter from './Userpages'

// Docs
import DocsRouter from './Docs'
import MarketplaceRouter from './Marketplace'

// Wrap authenticated components here instead of render() method

// Wrap each Route to an ErrorBoundary
const Route = withErrorBoundary(ErrorPage)(RouterRoute)

const AuthenticationRouter = () => ([
    <Route exact path={routes.auth.login()} component={LoginPage} key="LoginPage" />,
    <Route exact path={routes.auth.logout()} component={LogoutPage} key="LogoutPage" />,
    // Redirect old paths to login
    <Redirect from="/login/auth" to={routes.auth.login()} key="LoginRedirect" />,
    <Redirect from="/signup" to={routes.auth.login()} key="SignUpRedirect" />,
    <Redirect from="/forgotPassword" to={routes.auth.login()} key="ForgotPasswordRedirect" />,
    <Redirect from="/resetPassword" to={routes.auth.login()} key="ResetPasswordRedirect" />,
    <Redirect from="/register" to={routes.auth.login()} key="RegisterRedirect" />,
    <Redirect from="/register/register" to={routes.auth.login()} key="LegacyRegisterRedirect" />,
    <Redirect from="/register/resetPassword" to={routes.auth.login()} key="LegacyResetPasswordRedirect" />,
    <Redirect from="/register/forgotPassword" to={routes.auth.login()} key="LegacyForgotPasswordRedirect" />,
])

const MiscRouter = () => ([
    <Route exact path="/error" component={GenericErrorPage} key="GenericErrorPage" />,
    <Route component={NotFoundPage} key="NotFoundPage" />,
])

const App = () => (
    <Router history={history}>
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
                                {MiscRouter()}
                            </Switch>
                            <Notifications />
                        </ActivityResourceProvider>
                        <AnalyticsTracker />
                    </GlobalInfoWatcher>
                </ModalProvider>
            </ModalPortalProvider>
        </StreamrClientProvider>
    </Router>
)

export default App
