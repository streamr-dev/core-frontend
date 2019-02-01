import React from 'react'

import Table from './modules/Table'
import Chart from './modules/Chart'
import Button from './modules/Button'
import CommentModule from './modules/Comment'

import { ModuleLoader } from './ModuleSubscription'

const Modules = {
    TableModule: Table,
    ChartModule: Chart,
    CommentModule,
}

const Widgets = {
    StreamrButton: Button,
}

class ModuleUI extends React.Component {
    static contextType = ModuleLoader.Context

    render() {
        const { send } = this.context
        const module = this.props.module || this.context.module
        if (!module) { return null }
        const Module = module.widget ? Widgets[module.widget] : Modules[module.jsModule]
        if (!Module) { return null }

        return (
            <Module {...this.props} module={module} send={send} />
        )
    }
}

export default (props) => (
    <ModuleLoader {...props}>
        <ModuleUI {...props} />
    </ModuleLoader>
)
