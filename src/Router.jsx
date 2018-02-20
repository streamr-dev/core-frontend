// @flow

import React, {Component} from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import App from './App'

import Home from './components/Home'
import Products from './components/Products'
import Categories from './components/Categories'
import Web3Tester from './components/Web3Tester'

import links from './links'

export default class ReactRouter extends Component<{}> {

    render() {
        return (
            <BrowserRouter>
                <App>
                    <Route path={links.products} component={Products}/>
                    <Route path={links.categories} component={Categories}/>
                    <Route path={links.web3tester} component={Web3Tester}/>
                    <Route exact path={links.home} component={Home}/>
                </App>
            </BrowserRouter>
        )
    }
}