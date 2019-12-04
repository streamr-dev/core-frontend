// @flow

import { createContext, useContext, type Context, useMemo } from 'react'
import ModuleStyles from '$editor/shared/components/Module.pcss'
import isModuleResizable from '$editor/canvas/utils/isModuleResizable'
import { getModuleMessageLevel } from '$editor/canvas/state/messages'
import useCanvas from '../CanvasController/useCanvas'

type Module = {
    canRefresh: boolean,
    displayName?: ?string,
    hash: string,
    inputs: Array<any>,
    jsModule?: ?string,
    name: string,
    outputs: Array<any>,
    params: Array<any>,
    widget?: ?string,
    [string]: any,
}

type Canvas = {
    id: ?string,
    modules: Array<any>,
}

type ModuleManifest = {
    isCanvasAdjustable?: boolean,
    isCanvasEditable?: boolean,
    hasWritePermission?: boolean,
    module: Module,
    messageLevel?: string,
}

type UseModuleHook = {
    canvas: Canvas,
    moduleClassNames?: Array<?string>,
    isResizable?: boolean,
} & ModuleManifest

export const ModuleContext = (createContext({
    isCanvasEditable: false,
    isCanvasAdjustable: false,
    hasWritePermission: false,
    module: {
        canRefresh: false,
        displayName: '',
        hash: '',
        inputs: [],
        jsModule: '',
        name: '',
        outputs: [],
        params: [],
        widget: '',
    },
}): Context<ModuleManifest>)

export default (): UseModuleHook => {
    const { module: mod, isCanvasAdjustable, isCanvasEditable, hasWritePermission } = useContext(ModuleContext)

    const canvas = useCanvas() || {
        id: '',
        modules: [mod],
    }

    const { jsModule, widget } = mod

    const moduleClassNames = useMemo(() => (
        [
            ModuleStyles[jsModule],
            ModuleStyles[widget],
        ]
    ), [jsModule, widget])

    const isResizable = isModuleResizable({
        jsModule,
        widget,
    })

    const messageLevel = getModuleMessageLevel(canvas, mod.hash)

    return useMemo(() => ({
        canvas,
        isCanvasAdjustable,
        isCanvasEditable,
        hasWritePermission,
        isResizable,
        module: mod,
        moduleClassNames,
        messageLevel,
    }), [
        canvas,
        isCanvasAdjustable,
        isCanvasEditable,
        hasWritePermission,
        isResizable,
        mod,
        moduleClassNames,
        messageLevel,
    ])
}
