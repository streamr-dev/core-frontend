// @flow

import React, {Component} from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import App from './components/App'

export default class ReactRouter extends Component {

    render() {
        return (
            <BrowserRouter>
                <App>
                    <Route path="/" component={() => {}}/>
                </App>
            </BrowserRouter>
        )
    }
}