// @flow

import React from 'react'
import { render } from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from './history'

import App from './marketplace/components/App'

const root = document.getElementById('root')

if (root) {
    render(
        <ConnectedRouter history={createHistory()}>
            <App />
        </ConnectedRouter>,
        root,
    )
} else {
    throw new Error('Root element could not be found.')
}
