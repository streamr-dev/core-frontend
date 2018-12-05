// @flow

import React from 'react'
import { render, hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Frontload } from 'react-frontload'
import createStore from './store'

import App from './marketplace/components/App'

const { store, history } = createStore()

const root = document.getElementById('root')

if (!root) {
    throw new Error('Root element could not be found.')
}

const app = (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Frontload noServerRender>
                <App />
            </Frontload>
        </ConnectedRouter>
    </Provider>
)

if (root.hasChildNodes()) {
    hydrate(app, root)
} else {
    render(app, root)
}
