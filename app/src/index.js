// @flow

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './marketplace/components/App'
import GlobalInfoWatcher from './marketplace/containers/GlobalInfoWatcher'
import store from './store'
import './setup'
import './layout'

/*eslint-disable */
const root = document.getElementById('root')
if (root) {
    ReactDOM.render(
        <Provider store={store}>
            <GlobalInfoWatcher>
                <App />
            </GlobalInfoWatcher>
        </Provider>,
        root,
    )
} else {
    throw new Error('Root element could not be found.')
}
