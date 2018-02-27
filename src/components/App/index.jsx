// @flow

import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Page from '../Page'
import ProductPage from '../../containers/ProductPage'
import Products from '../../containers/Products'
import { formatPath } from '../../utils/url'

import store from '../../store'
import links from '../../links'
import 'holderjs'

export default class App extends Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Page>
                        <Route path={formatPath(links.products, ':id')} component={ProductPage} />
                        <Route exact path={links.main} component={Products} />
                        <Route component={() => '404'}/>
                    </Page>
                </BrowserRouter>
            </Provider>
        )
    }
}
