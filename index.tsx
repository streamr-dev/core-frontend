import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import App from './app/src/app'
import store from './app/src/store'
const container = document.getElementById('root')
const root = createRoot(container as HTMLElement)

if (container) {
    root.render(
        <Provider store={store}>
            <App />
        </Provider>,
    )
} else {
    throw new Error('Root element could not be found.')
}
