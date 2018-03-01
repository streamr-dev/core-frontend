// @flow

import React from 'react'
import { render } from 'react-dom'
import App from './components/App'

const root = document.getElementById('root')

if (root) {
    render(<App />, root)
} else {
    throw new Error('Root element could not be found.')
}
