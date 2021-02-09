/**
 * Maps module jsModule/widget to UI components.
 */

import React from 'react'

import useModule from '$editor/canvas/components/ModuleRenderer/useModule'
import useIsCanvasRunning from '$editor/canvas/hooks/useIsCanvasRunning'
import useModuleApi from '$editor/canvas/components/ModuleRenderer/useModuleApi'
import TableModule from './modules/Table'
import ChartModule from './modules/Chart'
import StreamrButton from './modules/Button'
import CommentModule from './modules/Comment'
import StreamrTextField from './modules/TextField'
import LabelModule from './modules/Label'
import CanvasModule from './modules/Canvas'
import ForEachModule from './modules/ForEach'
import StreamrSwitcher from './modules/Switcher'
import MapModule from './modules/Map'
import HeatmapModule from './modules/Heatmap'
import RunStateLoader from './RunStateLoader'
import ExportCSVModule from './modules/ExportCSV'
import SchedulerModule from './modules/Scheduler'
import CustomModule from './modules/Custom'
import SolidityModule from './modules/Solidity'

// Set by module.jsModule
const Modules = {
    TableModule,
    ChartModule,
    CommentModule,
    LabelModule,
    CanvasModule,
    ForEachModule,
    ExportCSVModule,
    SchedulerModule,
    MapModule,
    ImageMapModule: MapModule,
    HeatmapModule,
    CustomModule,
    SolidityModule,
}

// Set by module.widget
const Widgets = {
    StreamrButton,
    StreamrTextField,
    StreamrSwitcher,
}

const ModuleUI = ({
    canvasId, dashboardId, moduleHash, autoSize, ...props
}) => {
    const { module: mod, canvas } = useModule()
    const { items } = canvas
    const isDashboard = !!items
    const api = useModuleApi()
    const canvasIsRunning = useIsCanvasRunning()
    const isRunning = isDashboard || canvasIsRunning

    return (
        <RunStateLoader
            {...props}
            moduleHash={mod.hash || moduleHash}
            isActive={isRunning}
            canvasId={canvasId || canvas.id}
            dashboardId={dashboardId}
        >
            {(props) => {
                const { module: loadedModule } = props
                if (!loadedModule) {
                    return null
                }

                const Module = loadedModule.widget ? Widgets[loadedModule.widget] : Modules[loadedModule.jsModule]

                if (!Module) {
                    return null
                }

                return (
                    <Module
                        {...props}
                        moduleHash={loadedModule.hash}
                        module={loadedModule}
                        api={api}
                    />
                )
            }}
        </RunStateLoader>
    )
}

export default ModuleUI
