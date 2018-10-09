// @flow

import React from 'react'
import { Route as RouterRoute, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import Page from '../../containers/Page'
import ProductPage from '../../containers/ProductPage'
import EditProductPage from '../../containers/EditProductPage'
import Products from '../../containers/Products'
import LoginPage from '../../containers/LoginPage'
import AccountPage from '../../containers/AccountPage'
import ComponentLibrary from '../../components/ComponentLibrary'
// TODO: RE-ENABLE THIS WHEN USERPAGES ARE READY
// import UserPages from '../../../userpages'

import ModalRoot from '../../containers/ModalRoot'
import Notifications from '../../containers/Notifications'
import { formatPath } from '../../utils/url'
import { userIsAuthenticated, userIsNotAuthenticated } from '../../utils/auth'
import links from '../../../links'
import history from '../../../history'
import '../../../analytics'

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
                    {!isProduction() && <Route exact path={formatPath(links.componentLibrary)} component={ComponentLibrary} />}
                    {/* TODO: RE-ENABLE THIS WHEN USERPAGES ARE READY */}
                    {/* {!isProduction() && <UserPages />} */}
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
