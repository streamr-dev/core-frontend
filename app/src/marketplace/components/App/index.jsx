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
import UserCanvasesPage from '../../../userpages/components/UserCanvasesPage'
import UserStreamsPage from '../../../userpages/components/UserStreamsPage'
import UserDashboardsPage from '../../../userpages/components/UserDashboardsPage'
import UserProductsPage from '../../../userpages/components/UserProductsPage'
import UserPurchasesPage from '../../../userpages/components/UserPurchasesPage'
import UserTransactionsPage from '../../../userpages/components/UserTransactionsPage'
import UserSettingsPage from '../../../userpages/components/UserSettingsPage'

import ModalRoot from '../../containers/ModalRoot'
import Notifications from '../../containers/Notifications'
import { formatPath } from '../../utils/url'
import { userIsAuthenticated, userIsNotAuthenticated } from '../../utils/auth'
import links from '../../../links'
import history from '../../../history'
import '../../../analytics'

import './app.pcss'
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
                    {/* Userpages.. TODO: dynamic route ? u/username.. TODO: remove unused links */}
                    <Route path={links.userpages.canvases} component={UserCanvasesPage} />
                    <Route path={links.userpages.streams} component={UserStreamsPage} />
                    <Route path={links.userpages.dashboards} component={UserDashboardsPage} />
                    <Route path={links.userpages.products} component={UserProductsPage} />
                    <Route path={links.userpages.purchases} component={UserPurchasesPage} />
                    <Route path={links.userpages.transactions} component={UserTransactionsPage} />
                    <Route path={links.userpages.settings} component={UserSettingsPage} />
                    {/* / Userpages */}
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

