import React from 'react'

import Table from './modules/Table'
import Chart from './modules/Chart'
import Button from './modules/Button'
import CommentModule from './modules/Comment'
import TextField from './modules/TextField'

const Modules = {
    TableModule: Table,
    ChartModule: Chart,
    CommentModule,
}

const Widgets = {
    StreamrButton: Button,
    StreamrTextField: TextField,
}

export default (props) => {
    const { module } = props
    if (!module) { return null }
    const Module = module.widget ? Widgets[module.widget] : Modules[module.jsModule]
    if (!Module) { return null }

    return (
        <Module {...props} />
    )
}
