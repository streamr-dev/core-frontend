/**
 * Maps module jsModule/widget to UI components.
 */

import React, { useContext } from 'react'

import { Context as ResizableContext } from '$editor/canvas/components/Resizable'
import { Context as SizeConstraintContext } from '$editor/canvas/components/Resizable/SizeConstraintProvider'
import Probe from '$editor/canvas/components/Resizable/SizeConstraintProvider/Probe'
import TableModule from './modules/Table'
import ChartModule from './modules/Chart'
import StreamrButton from './modules/Button'
import CommentModule from './modules/Comment'
import StreamrTextField from './modules/TextField'
import LabelModule from './modules/Label'
import CanvasModule from './modules/Canvas'
import StreamrSwitcher from './modules/Switcher'
import MapModule from './modules/Map'
import HeatmapModule from './modules/Heatmap'
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
    HeatmapModule,
    CustomModule,
}

// Set by module.widget
const Widgets = {
    StreamrButton,
    StreamrTextField,
    StreamrSwitcher,
}

const AutoSizeWrapper = ({ children }) => {
    const { width, height, enabled } = useContext(ResizableContext)
    const { minHeight } = useContext(SizeConstraintContext)
    const extraWidth = 200
    const extraHeight = 150

    return enabled ? (
        <div
            style={{
                height: (height - minHeight) + extraHeight,
                // Above calculation doesn't prevent the UI from shrinking via
                // a non-resize action (adding/removing a param or a variadic port).
                // One solution, such as the one below, is to enforce `min-width`
                // and `min-height` on the actual wrapper.
                minHeight: extraHeight,
                minWidth: extraWidth,
                overflow: 'hidden',
                position: 'relative',
                width,
            }}
        >
            <Probe group="ModuleHeight" id="UI" height={extraHeight} />
            <Probe group="UiWidth" id="UI" width={extraWidth} />
            {children}
        </div>
    ) : children
}

export default ({ autoSize, ...props }) => (
    <ModuleLoader {...props}>
        {(props) => {
            const module = props.module || {}
            const Module = module.widget ? Widgets[module.widget] : Modules[module.jsModule]

            if (!Module) {
                return null
            }

            if (autoSize) {
                return (
                    <AutoSizeWrapper>
                        <Module {...props} />
                    </AutoSizeWrapper>
                )
            }

            return <Module {...props} />
        }}
    </ModuleLoader>
)
