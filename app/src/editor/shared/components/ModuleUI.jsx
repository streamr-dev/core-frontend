import React from 'react'

import TableModule from './modules/Table'
import ChartModule from './modules/Chart'
import StreamrButton from './modules/Button'
import CommentModule from './modules/Comment'
import StreamrTextField from './modules/TextField'
import LabelModule from './modules/Label'

const Modules = {
    TableModule,
    ChartModule,
    CommentModule,
    LabelModule,
}

const Widgets = {
    StreamrButton,
    StreamrTextField,
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
