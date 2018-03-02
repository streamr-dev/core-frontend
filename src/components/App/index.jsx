// @flow

import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Page from '../Page'
import Home from '../../containers/Home'
import Product from '../../containers/Product'

import store from '../../store'
import links from '../../links'

export default class App extends Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Page>
                        <Route exact path={`${links.products}/:id`} component={Product} />
                        <Route exact path={links.main} component={Home} />
                        <Route component={() => '404'}/>
                    </Page>
                </BrowserRouter>
            </Provider>
        )
    }
}
