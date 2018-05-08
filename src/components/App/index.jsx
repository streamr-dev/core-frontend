// @flow

import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import Page from '../Page'
import ProductPage from '../../containers/ProductPage'
import EditProductPage from '../../containers/EditProductPage'
import Products from '../../containers/Products'
import LoginPage from '../../containers/LoginPage'
import AccountPage from '../../containers/AccountPage'
import CreateProductPage from '../../containers/CreateProductPage'
import ModalRoot from '../../containers/ModalRoot'
import Notifications from '../../containers/Notifications'
import { formatPath } from '../../utils/url'
import { userIsAuthenticated, userIsNotAuthenticated } from '../../utils/auth'
import links from '../../links'
import history from '../../history'
import '../../analytics'

import './app.pcss'

// Wrap authenticated components here instead of render() method
const AccountAuth = userIsAuthenticated(AccountPage)
const CreateProductAuth = userIsAuthenticated(CreateProductPage)
const EditProductAuth = userIsAuthenticated(EditProductPage)
const LoginRedirect = userIsNotAuthenticated(LoginPage)

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
                    <Route component={() => '404'} />
                </Page>
                <Notifications />
                <ModalRoot />
            </div>
        </ConnectedRouter>
    </div>
)

export default App
