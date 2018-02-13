// @flow

import React, {Component} from 'react'
import {BrowserRouter, Route, Redirect} from 'react-router-dom'

import App from './App'

import Page1 from './components/Page1'
import Page2 from './components/Page2'

export default class ReactRouter extends Component {

    render() {
        return (
            <BrowserRouter>
                <App>
                    <Route path="/page1" component={Page1}/>
                    <Route path="/page2" component={Page2}/>
                    <Redirect from="/" to="/page1"/>
                </App>
            </BrowserRouter>
        )
    }
}