// @flow

import { createContext, useContext, type Context, useMemo } from 'react'
import cx from 'classnames'
import ModuleStyles from '$editor/shared/components/Module.pcss'
import isModuleResizable from '$editor/canvas/utils/isModuleResizable'
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

type UseModuleHook = {
    canvas: Canvas,
    isCanvasAdjustable?: boolean,
    isCanvasEditable?: boolean,
    isResizable?: boolean,
    module: Module,
    moduleClassNames?: ?string,
}

type ModuleManifest = {
    isCanvasAdjustable?: boolean,
    isCanvasEditable?: boolean,
    module: Module,
}

export const ModuleContext = (createContext({
    isCanvasEditable: false,
    isCanvasAdjustable: false,
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
    const { module: mod, isCanvasAdjustable, isCanvasEditable } = useContext(ModuleContext)

    const canvas = useCanvas() || {
        id: '',
        modules: [mod],
    }

    const { jsModule, widget } = mod

    const moduleClassNames = cx(ModuleStyles[jsModule], ModuleStyles[widget])

    const isResizable = isModuleResizable({
        jsModule,
        widget,
    })

    return useMemo(() => ({
        canvas,
        isCanvasAdjustable,
        isCanvasEditable,
        isResizable,
        module: mod,
        moduleClassNames,
    }), [
        canvas,
        isCanvasAdjustable,
        isCanvasEditable,
        isResizable,
        mod,
        moduleClassNames,
    ])
}
