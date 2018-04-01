// @flow

import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import Page from '../Page'
import ProductPage from '../../containers/ProductPage'
import Products from '../../containers/Products'
import LoginPage from '../../containers/LoginPage'
import AccountPage from '../../containers/AccountPage'
import MyProductsPage from '../../containers/MyProductsPage'
import CreateProductPage from '../../containers/CreateProductPage'
import PreviewProductPage from '../../containers/PreviewProductPage'
import { formatPath } from '../../utils/url'
import { userIsAuthenticated, userIsNotAuthenticated } from '../../utils/auth'
import { checkLogin } from '../../modules/user/actions'
import links from '../../links'
import history from '../../history'
import 'holderjs'

const basename = process.env.MARKETPLACE_BASE_URL

// Wrap authenticated components here instead of render() method
const AccountAuth = userIsAuthenticated(AccountPage)
const MyProductsAuth = userIsAuthenticated(MyProductsPage)
const CreateProductAuth = userIsAuthenticated(CreateProductPage)
const PreviewProductAuth = userIsAuthenticated(PreviewProductPage)
const EditProductAuth = userIsAuthenticated(ProductPage) // TODO: userIsOwner authentication
const LoginRedirect = userIsNotAuthenticated(LoginPage)

type Props = {
    checkLogin: () => void,
}

class App extends Component<Props> {
    componentDidMount() {
        this.props.checkLogin()
    }

    render() {
        return (
            <ConnectedRouter basename={basename} history={history}>
                <Page>
                    <Route exact path={formatPath(links.products, ':id')} render={(props) => <ProductPage {...props} editor={false} />} />
                    <Route exact path={formatPath(links.products, ':id', 'edit')} render={(props) => <EditProductAuth {...props} editor />} />
                    <Route exact path={links.main} component={Products} />
                    <Route exact path={links.login} component={LoginRedirect} />
                    <Route exact path={links.account} component={AccountAuth} />
                    <Route exact path={links.createProduct} component={CreateProductAuth} />
                    <Route exact path={links.createProductPreview} component={PreviewProductAuth} />
                    <Route exact path={links.myProducts} component={MyProductsAuth} />
                    <Route component={() => '404'} />
                </Page>
            </ConnectedRouter>
        )
    }
}

const mapDispatchToProps = (dispatch: Function) => ({
    checkLogin: () => dispatch(checkLogin()),
})

export default connect(null, mapDispatchToProps)(App)
