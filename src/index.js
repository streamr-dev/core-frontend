// @flow

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import App from './components/App'
import Web3Provider from './containers/Web3Provider'

import store from './store'

const root = document.getElementById('root')

if (root) {
    render(
        <Provider store={store}>
            <Web3Provider>
                <App/>
            </Web3Provider>
        </Provider>,
        root
    )
} else {
    throw new Error('Root element could not be found.')
}
