/**
 * Handles starting & stopping a canvas.
 */

import React, { useRef, useEffect } from 'react'

import * as CanvasState from '../state'

export const RunControllerContext = React.createContext()

const EMPTY = {}

export default function useCanvasStateChangeEffect(canvas = EMPTY, onChange) {
    const canvasIsRunning = CanvasState.isRunning(canvas)
    const prevIsRunning = useRef(canvasIsRunning)

    useEffect(() => {
        if (canvasIsRunning === prevIsRunning.current) { return }
        prevIsRunning.current = canvasIsRunning
        onChange(canvasIsRunning)
    }, [canvasIsRunning, prevIsRunning, onChange, canvas])
}
