import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/src/app'
const container = document.getElementById('root')
const root = createRoot(container as HTMLElement)

if (container) {
    root.render(
        <App />
    )
} else {
    throw new Error('Root element could not be found.')
}
