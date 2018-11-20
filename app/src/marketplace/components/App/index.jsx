// @flow

import './globalStyles'

import React from 'react'
import { Route as RouterRoute, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import ModalManager from '../../containers/ModalManager'
import ProductPage from '../../containers/ProductPage'
import StreamPreviewPage from '../../containers/StreamPreviewPage'
import EditProductPage from '../../containers/EditProductPage'
import Products from '../../containers/Products'
import LoginPage from '../../containers/LoginPage'
import LogoutPage from '$auth/containers/LogoutPage'
import AccountPage from '../../containers/AccountPage'
import ComponentLibrary from '../../components/ComponentLibrary'
// TODO: Use '../../../userpages' when userpages are production-ready. #userpages-on-demand
import UserPages from '../../../userpages/current'
// TODO: Use '../../../docs' when docs are production-ready.
import Docs from '../../../docs/current'

import ModalRoot from '../../containers/ModalRoot'
import Notifications from '../../containers/Notifications'
import { formatPath } from '$shared/utils/url'
import { userIsAuthenticated, userIsNotAuthenticated } from '../../utils/auth'
import links from '../../../links'
import history from '../../../history'
import '../../../analytics'

import LocaleSetter from '../../containers/LocaleSetter'
import NotFoundPage from '../NotFoundPage'
import GoogleAnalyticsTracker from '../GoogleAnalyticsTracker'
import isProduction from '../../utils/isProduction'
import ErrorPageView from '../ErrorPageView'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import routes from '$routes'

// Wrap authenticated components here instead of render() method
const AccountAuth = userIsAuthenticated(AccountPage)
const CreateProductAuth = userIsAuthenticated(EditProductPage)
const EditProductAuth = userIsAuthenticated(EditProductPage)
const LoginRedirect = userIsNotAuthenticated(LoginPage)

// Other components
const ProductPurchasePage = (props) => <ProductPage overlayPurchaseDialog {...props} />
const ProductPublishPage = (props) => <ProductPage overlayPublishDialog {...props} />

// Wrap each Route to an ErrorBoundary
const Route = withErrorBoundary(ErrorPageView)(RouterRoute)

const App = () => (
    <div>
        <ConnectedRouter history={history}>
            <div id="app">
                <LocaleSetter />
                <ModalManager />
                <Switch>
                    <Route exact path={routes.logout()} component={LogoutPage} />
                    <Route path={routes.editProduct()} component={EditProductAuth} />
                    <Route path={formatPath(links.products, ':id', 'purchase')} component={ProductPurchasePage} />
                    <Route path={formatPath(links.products, ':id', 'publish')} component={ProductPublishPage} />
                    <Route path={formatPath(links.products, ':id', 'streamPreview', ':streamId')} component={StreamPreviewPage} />
                    <Route path={formatPath(links.products, ':id')} component={ProductPage} />
                    <Route exact path={links.main} component={Products} />
                    <Route exact path={formatPath(links.internalLogin, ':type?')} component={LoginRedirect} />
                    <Route exact path={formatPath(links.account, ':tab(purchases|products)')} component={AccountAuth} />
                    <Redirect exact from={links.account} to={formatPath(links.account, 'purchases')} />
                    <Route exact path={links.createProduct} component={CreateProductAuth} />
                    <Route exact path={formatPath(links.docs)} component={Docs} />
                    {!isProduction() && <Route exact path={formatPath(links.componentLibrary)} component={ComponentLibrary} />}
                    {(true || !isProduction()) && <UserPages /> /* TODO: temporary fix to get user pages for production */}
                    <Route exact path="/error" component={ErrorPageView} />
                    <Route component={NotFoundPage} />
                </Switch>
                <Notifications />
                <ModalRoot />
                {isProduction() && <GoogleAnalyticsTracker />}
            </div>
        </ConnectedRouter>
    </div>
)

export default App
