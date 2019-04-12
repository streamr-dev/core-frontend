/**
 * Maps module jsModule/widget to UI components.
 */

import React from 'react'

import TableModule from './modules/Table'
import ChartModule from './modules/Chart'
import StreamrButton from './modules/Button'
import CommentModule from './modules/Comment'
import StreamrTextField from './modules/TextField'
import LabelModule from './modules/Label'
import CanvasModule from './modules/Canvas'
import StreamrSwitcher from './modules/Switcher'
import MapModule from './modules/Map'
import ModuleLoader from './ModuleLoader'
import ExportCSVModule from './modules/ExportCSV'
import SchedulerModule from './modules/Scheduler'
import CustomModule from './modules/Custom'

// Set by module.jsModule
const Modules = {
    TableModule,
    ChartModule,
    CommentModule,
    LabelModule,
    CanvasModule,
    ExportCSVModule,
    SchedulerModule,
    MapModule,
    ImageMapModule: MapModule,
    CustomModule,
}

// Set by module.widget
const Widgets = {
    StreamrButton,
    StreamrTextField,
    StreamrSwitcher,
}

export default (props) => (
    <ModuleLoader {...props}>
        {(props) => {
            const { module } = props
            if (!module) { return null }
            const Module = module.widget ? Widgets[module.widget] : Modules[module.jsModule]
            if (!Module) { return null }
            return <Module {...props} />
        }}
    </ModuleLoader>
)
