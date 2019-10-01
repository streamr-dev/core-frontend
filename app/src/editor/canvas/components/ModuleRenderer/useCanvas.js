// @flow

import { createContext, useContext, type Context, useMemo } from 'react'
import { RunStates } from '../../state'

type Canvas = {
    id: ?string,
    modules: Array<any>,
    state: $Values<typeof RunStates>,
}

type CanvasManifest = {
    canvas: Canvas,
    isAdjustable: boolean,
    isEditable: boolean,
}

type UseCanvasHook = CanvasManifest & {
    isRunning: boolean,
}

export const CanvasContext = (createContext({
    isAdjustable: false,
    isEditable: false,
    canvas: {
        id: null,
        state: RunStates.Stopped,
        modules: [],
    },
}): Context<CanvasManifest>)

export default (): UseCanvasHook => {
    const { canvas, isEditable, isAdjustable } = useContext(CanvasContext)
    const isRunning = canvas.state === RunStates.Running

    return useMemo(() => ({
        canvas,
        isAdjustable,
        isEditable,
        isRunning,
    }), [
        canvas,
        isAdjustable,
        isEditable,
        isRunning,
    ])
}
