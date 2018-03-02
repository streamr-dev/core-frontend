// @flow

import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Page from '../Page'
import Home from '../Home'
import Products from '../../containers/Products'

import store from '../../store'
import links from '../../links'

const basename = process.env.MARKETPLACE_BASE_URL || '/'

export default class App extends Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter basename={basename}>
                    <Page>
                        <Route path={`${links.products}/:id`} component={Products} />
                        <Route exact path={links.main} component={Home} />
                        <Route component={() => '404'}/>
                    </Page>
                </BrowserRouter>
            </Provider>
        )
    }
}
