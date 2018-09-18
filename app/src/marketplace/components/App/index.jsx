// @flow

import React from 'react'
import { Route as RouterRoute, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import Page from '../../../../../marketplace/src/containers/Page/index'
import ProductPage from '../../../../../marketplace/src/containers/ProductPage/index'
import EditProductPage from '../../../../../marketplace/src/containers/EditProductPage/index'
import Products from '../../../../../marketplace/src/containers/Products/index'
import LoginPage from '../../../../../marketplace/src/containers/LoginPage/index'
import AccountPage from '../../../../../marketplace/src/containers/AccountPage/index'
import ModalRoot from '../../../../../marketplace/src/containers/ModalRoot/index'
import Notifications from '../../../../../marketplace/src/containers/Notifications/index'
import { formatPath } from '../../../../../marketplace/src/utils/url'
import { userIsAuthenticated, userIsNotAuthenticated } from '../../../../../marketplace/src/utils/auth'
import links from '../../../../../marketplace/src/links'
import history from '../../../../../marketplace/src/history'
import '../../../../../marketplace/src/analytics'

import './app.pcss'
import LocaleSetter from '../../containers/LocaleSetter'
import NotFoundPage from '../NotFoundPage'
import GoogleAnalyticsTracker from '../GoogleAnalyticsTracker'
import isProduction from '../../utils/isProduction'
import ErrorPageView from '../ErrorPageView'
import withErrorBoundary from '../../utils/withErrorBoundary'

// Wrap authenticated components here instead of render() method
const AccountAuth = userIsAuthenticated(AccountPage)
const CreateProductAuth = userIsAuthenticated(EditProductPage)
const EditProductAuth = userIsAuthenticated(EditProductPage)
const LoginRedirect = userIsNotAuthenticated(LoginPage)

// Wrap each Route to an ErrorBoundary
const Route = withErrorBoundary(ErrorPageView)(RouterRoute)

const App = () => (
    <div>
        <ConnectedRouter history={history}>
            <div id="app">
                <LocaleSetter />
                <Page>
                    <Route path={formatPath(links.products, ':id', 'edit')} component={EditProductAuth} />
                    <Route
                        path={formatPath(links.products, ':id', 'purchase')}
                        render={(props) => <ProductPage overlayPurchaseDialog {...props} />}
                    />
                    <Route
                        path={formatPath(links.products, ':id', 'publish')}
                        render={(props) => <ProductPage overlayPublishDialog {...props} />}
                    />
                    <Route
                        path={formatPath(links.products, ':id', 'streamPreview', ':streamId')}
                        render={(props) => <ProductPage overlayStreamLiveDataDialog {...props} />}
                    />
                    <Route path={formatPath(links.products, ':id')} component={ProductPage} />
                    <Route exact path={links.main} component={Products} />
                    <Route exact path={formatPath(links.internalLogin, ':type?')} component={LoginRedirect} />
                    <Route exact path={formatPath(links.account, ':tab(purchases|products)')} component={AccountAuth} />
                    <Redirect exact from={links.account} to={formatPath(links.account, 'purchases')} />
                    <Route exact path={links.createProduct} component={CreateProductAuth} />
                    <Route exact path="/error" component={ErrorPageView} />
                    <Route component={NotFoundPage} />
                </Page>
                <Notifications />
                <ModalRoot />
                {isProduction() && <GoogleAnalyticsTracker />}
            </div>
        </ConnectedRouter>
    </div>
)

export default App
