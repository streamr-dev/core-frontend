// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import Web3AndLoginWatcher from './containers/Web3AndLoginWatcher'

import store from './store'

const root = document.getElementById('root')

if (root) {
    render(
        <Provider store={store}>
            <Web3AndLoginWatcher>
                <App />
            </Web3AndLoginWatcher>
        </Provider>,
        root,
    )
} else {
    throw new Error('Root element could not be found.')
}
