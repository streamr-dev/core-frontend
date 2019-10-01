// @flow

import { createContext, useContext, type Context, useMemo } from 'react'
import cx from 'classnames'
import ModuleStyles from '$editor/shared/components/Module.pcss'
import isModuleResizable from '$editor/canvas/utils/isModuleResizable'

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

type UseModuleHook = {
    isResizable?: boolean,
    module: Module,
    moduleClassNames?: ?string,
}

export const ModuleContext = (createContext({
    canRefresh: false,
    displayName: '',
    hash: '',
    inputs: [],
    jsModule: '',
    name: '',
    outputs: [],
    params: [],
    widget: '',
}): Context<Module>)

export default (): UseModuleHook => {
    const mod = useContext(ModuleContext)
    const { jsModule, widget } = mod
    const moduleClassNames = cx(ModuleStyles[jsModule], ModuleStyles[widget])
    const isResizable = isModuleResizable({
        jsModule,
        widget,
    })

    return useMemo(() => ({
        isResizable,
        module: mod,
        moduleClassNames,
    }), [
        isResizable,
        mod,
        moduleClassNames,
    ])
}
