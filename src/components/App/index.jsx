// @flow

import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import Page from '../Page'
import ProductPage from '../../containers/ProductPage'
import EditProductPage from '../../containers/EditProductPage'
import Products from '../../containers/Products'
import LoginPage from '../../containers/LoginPage'
import AccountPage from '../../containers/AccountPage'
import MyProductsPage from '../../containers/MyProductsPage'
import CreateProductPage from '../../containers/CreateProductPage'
import PreviewProductPage from '../../containers/PreviewProductPage'
import ModalRoot from '../../containers/ModalRoot'
import { formatPath } from '../../utils/url'
import { userIsAuthenticated, userIsNotAuthenticated } from '../../utils/auth'
import links from '../../links'
import history from '../../history'
import 'holderjs'

const basename = process.env.MARKETPLACE_BASE_URL

// Wrap authenticated components here instead of render() method
const AccountAuth = userIsAuthenticated(AccountPage)
const MyProductsAuth = userIsAuthenticated(MyProductsPage)
const CreateProductAuth = userIsAuthenticated(CreateProductPage)
const PreviewProductAuth = userIsAuthenticated(PreviewProductPage)
const EditProductAuth = userIsAuthenticated(EditProductPage) // TODO: userIsOwner authentication
const LoginRedirect = userIsNotAuthenticated(LoginPage)

const App = () => (
    <div>
        <div id="app">
            <ConnectedRouter basename={basename} history={history}>
                <Page>
                    <Route path={formatPath(links.products, ':id', 'edit')} component={EditProductAuth} />
                    <Route path={formatPath(links.products, ':id')} component={ProductPage} />
                    <Route exact path={links.main} component={Products} />
                    <Route exact path={links.login} component={LoginRedirect} />
                    <Route exact path={links.account} component={AccountAuth} />
                    <Route exact path={links.createProduct} component={CreateProductAuth} />
                    <Route exact path={links.createProductPreview} component={PreviewProductAuth} />
                    <Route exact path={links.myProducts} component={MyProductsAuth} />
                    <Route component={() => '404'} />
                </Page>
            </ConnectedRouter>
        </div>
        <ModalRoot />
    </div>
)

export default App
