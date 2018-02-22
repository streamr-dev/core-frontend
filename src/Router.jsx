// @flow

import React, {Component} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import App from './App'

import Home from './components/Home'
import Products from './containers/Products'

import links from './links'

export default class ReactRouter extends Component<{}> {

    render() {
        return (
            <BrowserRouter>
                <App>
                    <Switch>
                        <Route path={`${links.products}/:id`} component={Products}/>
                        <Route exact path={links.main} component={Home}/>
                        <Route component={() => '404'}/>
                    </Switch>
                </App>
            </BrowserRouter>
        )
    }
}
