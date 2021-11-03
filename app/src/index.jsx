// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './app'
import store from './store'

const root = document.getElementById('root')

if (root) {
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        root,
    )
} else {
    throw new Error('Root element could not be found.')
}
