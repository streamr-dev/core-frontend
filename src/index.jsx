// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import Web3Watcher from './containers/Web3Watcher'

import store from './store'

const root = document.getElementById('root')

if (root) {
    render(
        <Provider store={store}>
            <Web3Watcher>
                <App />
            </Web3Watcher>
        </Provider>,
        root,
    )
} else {
    throw new Error('Root element could not be found.')
}
