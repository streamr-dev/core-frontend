// @flow

import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import Page from '../Page'
import ProductPage from '../../containers/ProductPage'
import Products from '../../containers/Products'
import LoginPage from '../../containers/LoginPage'
import AccountPage from '../../containers/AccountPage'
import { formatPath } from '../../utils/url'
import { userIsAuthenticated, userIsNotAuthenticated } from '../../utils/auth'
import { checkLogin } from '../../modules/user/actions'
import links from '../../links'
import 'holderjs'

const basename = process.env.MARKETPLACE_BASE_URL

// Wrap authenticated components here instead of render() method
const AccountAuth = userIsAuthenticated(AccountPage)
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
            <BrowserRouter basename={basename}>
                <Page>
                    <Route path={formatPath(links.products, ':id')} component={ProductPage} />
                    <Route exact path={links.main} component={Products} />
                    <Route exact path={links.login} component={LoginRedirect} />
                    <Route exact path={links.account} component={AccountAuth} />
                    <Route component={() => '404'}/>
                </Page>
            </BrowserRouter>
        )
    }
}

const mapDispatchToProps = (dispatch: Function) => ({
    checkLogin: () => dispatch(checkLogin()),
})

export default connect(null, mapDispatchToProps)(App)
