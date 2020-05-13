// @flow

import '$shared/assets/stylesheets'
import '@ibm/plex/css/ibm-plex.css'

import React from 'react'
import { Route as RouterRoute, Switch, Redirect, type Location } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import qs from 'query-string'

// Marketplace
import MarketplaceRouter from './Marketplace'
import Products from '$mp/containers/Products'

// Auth
import SessionProvider from '$auth/components/SessionProvider'
import LoginPage from '$auth/components/LoginPage'
import LogoutPage from '$auth/components/LogoutPage'
import SignupPage from '$auth/components/SignupPage'
import ForgotPasswordPage from '$auth/components/ForgotPasswordPage'
import ResetPasswordPage from '$auth/components/ResetPasswordPage'
import RegisterPage from '$auth/components/RegisterPage'

// Userpages
import UserpagesRouter from './Userpages'

// Docs
import DocsRouter from './Docs'

// Editor
import CanvasEditor from '$editor/canvas'
import CanvasEmbed from '$editor/canvas/components/Embed'
import DashboardEditor from '$editor/dashboard'

import { Provider as ModalPortalProvider } from '$shared/contexts/ModalPortal'
import { Provider as ModalProvider } from '$shared/contexts/ModalApi'
import Notifications from '$shared/components/Notifications'
import { formatPath } from '$shared/utils/url'
import { userIsAuthenticated } from '$auth/utils/userAuthenticated'
import links from '../links'
import history from '../history'
import '../analytics'

import LocaleSetter from '$mp/containers/LocaleSetter'
import NotFoundPage from '$shared/components/NotFoundPage'
import GoogleAnalyticsTracker from '$mp/components/GoogleAnalyticsTracker'
import isProduction from '$mp/utils/isProduction'
import GenericErrorPage from '$shared/components/GenericErrorPage'
import ErrorPage from '$shared/components/ErrorPage'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import Analytics from '$shared/utils/Analytics'
import routes from '$routes'

// Wrap authenticated components here instead of render() method

// Editor Auth
const DashboardEditorAuth = userIsAuthenticated(DashboardEditor)

// Wrap each Route to an ErrorBoundary
const Route = withErrorBoundary(ErrorPage)(RouterRoute)

const { editor } = links

const forwardTo = (routeFn: Function) => ({ location: { search } }: Location) => (
    <Redirect to={routeFn(qs.parse(search))} />
)

const AuthenticationRouter = () => ([
    <Route exact path={routes.auth.login()} component={LoginPage} key="LoginPage" />,
    <Route exact path={routes.auth.logout()} component={LogoutPage} key="LogoutPage" />,
    <Route path={routes.auth.signUp()} component={SignupPage} key="SignupPage" />,
    <Route path={routes.auth.forgotPassword()} component={ForgotPasswordPage} key="ForgotPasswordPage" />,
    <Route path={routes.auth.resetPassword()} component={ResetPasswordPage} key="ResetPasswordPage" />,
    <Route exact path={routes.auth.register()} component={RegisterPage} key="RegisterPage" />,
    <Redirect from="/login/auth" to={routes.auth.login()} key="LoginRedirect" />,
    <Route exact path="/register/register" key="RegisterRedirect" render={forwardTo(routes.auth.register)} />,
    <Route exact path="/register/resetPassword" key="ResetPasswordRedirect" render={forwardTo(routes.auth.resetPassword)} />,
    <Redirect from="/register/forgotPassword" to={routes.auth.forgotPassword()} key="ForgotPasswordRedirect" />,
])

const EditorRouter = () => ([
    <Route exact path="/" component={Products} key="root" />, // edge case for localhost
    <Route exact path={formatPath(editor.canvasEditor, ':id?')} component={CanvasEditor} key="CanvasEditor" />,
    <Route exact path={formatPath(editor.canvasEmbed)} component={CanvasEmbed} key="CanvasEmbed" />,
    <Route exact path={formatPath(editor.dashboardEditor, ':id?')} component={DashboardEditorAuth} key="DashboardEditor" />,
])

const MiscRouter = () => ([
    <Route exact path="/error" component={GenericErrorPage} key="GenericErrorPage" />,
    <Route component={NotFoundPage} key="NotFoundPage" />,
])

const App = () => (
    <ConnectedRouter history={history}>
        <SessionProvider>
            <ModalPortalProvider>
                <ModalProvider>
                    <LocaleSetter />
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
                    {isProduction() && <GoogleAnalyticsTracker />}
                </ModalProvider>
            </ModalPortalProvider>
        </SessionProvider>
    </ConnectedRouter>
)

export default App
