// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import Web3Watcher from './containers/Web3Watcher'

import store from './store'

const root = document.getElementById('root')

import { formatPrice } from './utils/price'

console.log(formatPrice(0.113344, 'month', 'DATA', 0))

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
