// @flow

import React, {Component} from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import App from './App'

import Home from './containers/Home'
import Products from './containers/Products'
import Product from './containers/Product'
import Categories from './containers/Categories'

import links from './links'

export default class ReactRouter extends Component<{}> {
    render() {
        return (
            <BrowserRouter>
                <App>
                    <Route exact path={links.products} component={Products}/>
                    <Route exact path={links.product} component={Product}/>
                    <Route exact path={links.categories} component={Categories} />
                    <Route exact path={links.home} component={Home}/>
                </App>
            </BrowserRouter>
        )
    }
}
