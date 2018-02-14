// @flow

import React, {Component} from 'react'
import {BrowserRouter, Route, Redirect} from 'react-router-dom'

import App from './App'

import Home from './components/Home'
import Products from './components/Products'

export default class ReactRouter extends Component {

    render() {
        return (
            <BrowserRouter>
                <App>
                    <Route path="/" component={Home}/>
                    <Route path="/products" component={Products}/>
                </App>
            </BrowserRouter>
        )
    }
}