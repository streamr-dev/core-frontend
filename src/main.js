// @flow

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import Router from './router.jsx'

import store from './store.js'

const id = 'root'
const root = document.getElementById(id)

if (!root) {
    throw new Error(`No element with id ${id} found!`)
}

render(
    <Provider store={store}>
        <Router/>
    </Provider>,
    root
)
