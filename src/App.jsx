import React from 'react'

import TopNav from './layouts/TopNav'
import './styles/common.pcss'
import './styles/canvas.pcss'

export default function App() {
    document.body.classList.add(...'main-navbar-fixed selected-theme canvas-editor-page main-menu-fixed'.split(' '))
    return (
        <TopNav />
    )
}
