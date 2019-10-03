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
import ForEachModule from './modules/ForEach'
import StreamrSwitcher from './modules/Switcher'
import MapModule from './modules/Map'
import HeatmapModule from './modules/Heatmap'
import RunStateLoader from './RunStateLoader'
import ExportCSVModule from './modules/ExportCSV'
import SchedulerModule from './modules/Scheduler'
import CustomModule from './modules/Custom'
import SolidityModule from './modules/Solidity'
import useModule from '$editor/canvas/components/ModuleRenderer/useModule'
import useIsCanvasRunning from '$editor/canvas/hooks/useIsCanvasRunning'

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

export default ({ autoSize, ...props }) => {
    const { module, canvas: { id: canvasId } } = useModule()
    const isRunning = useIsCanvasRunning()

    return (
        <RunStateLoader {...props}>
            {(props) => {
                const Module = module.widget ? Widgets[module.widget] : Modules[module.jsModule]

                if (!Module) {
                    return null
                }

                return (
                    <Module
                        {...props}
                        canvasId={canvasId}
                        isActive={isRunning}
                        moduleHash={module.hash}
                    />
                )
            }}
        </RunStateLoader>
    )
}
