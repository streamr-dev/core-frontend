// @flow

import React from 'react'
import { Router, Route as RouterRoute, Switch, Redirect } from 'react-router-dom'

import '$shared/assets/stylesheets'
import '@ibm/plex/css/ibm-plex.css'
import '$utils/setupSnippets'

// Marketplace
import Products from '$mp/containers/Products'

// Auth
import SessionProvider from '$auth/components/SessionProvider'
import LoginPage from '$auth/components/LoginPage'
import LogoutPage from '$auth/components/LogoutPage'

// Editor
import CanvasEditor from '$editor/canvas'
import CanvasEmbed from '$editor/canvas/components/Embed'
import DashboardEditor from '$editor/dashboard'

import { Provider as ModalPortalProvider } from '$shared/contexts/ModalPortal'
import { Provider as ModalProvider } from '$shared/contexts/ModalApi'
import Notifications from '$shared/components/Notifications'
import ActivityResourceProvider from '$shared/components/ActivityList/ActivityResourceProvider'
import { userIsAuthenticated } from '$auth/utils/userAuthenticated'

import NotFoundPage from '$shared/components/NotFoundPage'
import GoogleAnalyticsTracker from '$mp/components/GoogleAnalyticsTracker'
import isProduction from '$mp/utils/isProduction'
import GenericErrorPage from '$shared/components/GenericErrorPage'
import ErrorPage from '$shared/components/ErrorPage'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import Analytics from '$shared/utils/Analytics'
import routes from '$routes'

import history from '../history'
import '../analytics'

// Userpages
import UserpagesRouter from './Userpages'

// Docs
import DocsRouter from './Docs'
import MarketplaceRouter from './Marketplace'

// Wrap authenticated components here instead of render() method

// Editor Auth
const DashboardEditorAuth = userIsAuthenticated(DashboardEditor)

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

const EditorRouter = () => ([
    <Route exact path={routes.root()} component={Products} key="root" />, // edge case for localhost
    <Route exact path={routes.canvases.edit()} component={CanvasEditor} key="CanvasEditor" />,
    <Route exact path={routes.canvases.embed()} component={CanvasEmbed} key="CanvasEmbed" />,
    <Route exact path={routes.dashboards.edit()} component={DashboardEditorAuth} key="DashboardEditor" />,
])

const MiscRouter = () => ([
    <Route exact path="/error" component={GenericErrorPage} key="GenericErrorPage" />,
    <Route component={NotFoundPage} key="NotFoundPage" />,
])

const App = () => (
    <Router history={history}>
        <SessionProvider>
            <ModalPortalProvider>
                <ModalProvider>
                    <ActivityResourceProvider>
                        <Analytics />
                        <Switch>
                            {AuthenticationRouter()}
                            {MarketplaceRouter()}
                            {DocsRouter()}
                            {UserpagesRouter()}
                            {EditorRouter()}
                            {MiscRouter()}
                        </Switch>
                        <Notifications />
                    </ActivityResourceProvider>
                    {isProduction() && <GoogleAnalyticsTracker />}
                </ModalProvider>
            </ModalPortalProvider>
        </SessionProvider>
    </Router>
)

export default App
