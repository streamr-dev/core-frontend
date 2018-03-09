// @flow

import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Page from '../Page'
import ProductPage from '../../containers/ProductPage'
import Products from '../../containers/Products'
import LoginPage from '../../containers/LoginPage'
import AccountPage from '../../containers/AccountPage'
import { formatPath } from '../../utils/url'

import store from '../../store'
import links from '../../links'
import 'holderjs'

const basename = process.env.MARKETPLACE_BASE_URL

export default class App extends Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter basename={basename}>
                    <Page>
                        <Route path={formatPath(links.products, ':id')} component={ProductPage} />
                        <Route exact path={links.main} component={Products} />
                        <Route exact path={links.login} component={LoginPage} />
                        <Route exact path={links.account} component={AccountPage} />
                        <Route component={() => '404'}/>
                    </Page>
                </BrowserRouter>
            </Provider>
        )
    }
}
