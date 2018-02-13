// @flow

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import Router from './router.jsx'

import store from './store.js'

render(
    <Provider store={store}>
        <Router />
    </Provider>,
    document.getElementById('root')
)
