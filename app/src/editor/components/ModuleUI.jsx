import React from 'react'

import Table from '../modules/Table'
import Button from '../modules/Button'

import { ModuleLoader } from './ModuleSubscription'

const Modules = {
    TableModule: Table,
}

const Widgets = {
    StreamrButton: Button,
}

class ModuleUI extends React.Component {
    static contextType = ModuleLoader.Context

    render() {
        const { module, send } = this.context
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
