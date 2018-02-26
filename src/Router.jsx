// @flow

import React, {Component} from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import App from './App'

import Home from './components/Home'
import Products from './containers/Products'
import Categories from './components/Categories'

import links from './links'

export default class ReactRouter extends Component<{}> {

    render() {
        return (
            <BrowserRouter>
                <App>
                    <Route path={links.products} component={Products}/>
                    <Route path={links.categories} component={Categories}/>
                    <Route exact path={links.home} component={Home}/>
                </App>
            </BrowserRouter>
        )
    }
}
