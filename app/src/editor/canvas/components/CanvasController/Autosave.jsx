import React, { useContext, useEffect, useRef, useCallback, useMemo, useState } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'

import * as services from '../../services'
import * as CanvasState from '../../state'
import { isEqualCanvas, changedModules as getChangedModules } from '../../state/diff'
import useCanvas from './useCanvas'
import useCanvasUpdater from './useCanvasUpdater'
import * as RunController from './Run'

export const AutosaveContext = React.createContext()

function useTrackChanges() {
    const canvas = useCanvas()
    const [snapshot, setSnapshot] = useState(canvas)
    useEffect(() => {
        if (!snapshot) {
            setSnapshot(canvas)
        }
    }, [snapshot, canvas])

    const reset = useCallback((snapshot) => setSnapshot(snapshot), [setSnapshot])

    const changedModules = useMemo(() => (
        getChangedModules(snapshot, canvas)
    ), [snapshot, canvas])

    const hasChanges = !isEqualCanvas(canvas, snapshot)

    const moduleHasChanges = useCallback((hash) => (
        changedModules.includes(hash)
    ), [changedModules])

    const moduleNeedsUpdate = useCallback((hash) => (
        CanvasState.moduleNeedsUpdate(snapshot, canvas, hash)
    ), [snapshot, canvas])

    return useMemo(() => ({
        hasChanges,
        changedModules,
        moduleHasChanges,
        moduleNeedsUpdate,
        reset,
    }), [hasChanges, changedModules, reset, moduleHasChanges, moduleNeedsUpdate])
}

function useAutosaveEffect(onChange) {
    const runController = useContext(RunController.Context)
    const isMounted = useIsMounted()

    const canvas = useCanvas()
    const currCanvasRef = useRef(canvas)
    const prevCanvas = currCanvasRef.current
    currCanvasRef.current = canvas

    const savingCanvasRef = useRef()
    const lastServerStateRef = useRef()

    const onAutosaveComplete = useCallback((serverCanvas) => {
        const currentCanvas = currCanvasRef.current
        const savingCanvas = savingCanvasRef.current
        lastServerStateRef.current = serverCanvas
        const nextCanvas = CanvasState.applyChanges({
            sent: savingCanvas,
            received: serverCanvas,
            current: currentCanvas,
        })

        // do nothing if no changes
        if (nextCanvas === currentCanvas) { return }
        onChange(nextCanvas)
    }, [savingCanvasRef, currCanvasRef, onChange])

    const { isEditable } = runController

    const canvasChanged = useMemo(() => (
        !isEqualCanvas(prevCanvas, canvas)
    ), [prevCanvas, canvas])

    useEffect(() => {
        if (!isEditable || !canvasChanged) { return }
        const currentCanvas = currCanvasRef.current
        // no autosave if already saving canvas
        if (savingCanvasRef.current === currentCanvas) { return }
        // no autosave if current is equivalent to what we're already saving
        if (isEqualCanvas(savingCanvasRef.current, currentCanvas)) { return }
        // no autosave if last seen server state is equivalent
        if (isEqualCanvas(lastServerStateRef.current, currentCanvas)) { return }
        savingCanvasRef.current = currentCanvas
        services.autosave(currentCanvas)
            .then((...args) => {
                if (!isMounted()) { return }
                if (savingCanvasRef.current !== currentCanvas) { return } // ignore if canvas to be saved changed
                onAutosaveComplete(...args)
                savingCanvasRef.current = undefined
            }, (err) => {
                if (!isMounted()) { return }
                if (savingCanvasRef.current !== currentCanvas) { return } // ignore if canvas to be saved changed
                savingCanvasRef.current = undefined
                throw err
            })
    }, [canvasChanged, savingCanvasRef, isEditable, isMounted, onAutosaveComplete])
}

export function AutosaveProvider({ children }) {
    const isMounted = useIsMounted()
    const { replaceCanvas } = useCanvasUpdater()
    const [isAutosaving, setIsAutosaving] = useState(false)

    const onRun = useCallback(() => {
        if (!isMounted()) { return }
        setIsAutosaving(true)
    }, [setIsAutosaving, isMounted])

    const onDone = useCallback(() => {
        if (!isMounted()) { return }
        setIsAutosaving(false)
    }, [setIsAutosaving, isMounted])

    useEffect(() => {
        services.autosave.on('run', onRun)
        services.autosave.on('done', onDone)
        services.autosave.on('fail', onDone)
        return () => {
            services.autosave.off('run', onRun)
            services.autosave.off('done', onDone)
            services.autosave.off('fail', onDone)
        }
    }, [onDone, onRun])

    const { moduleNeedsUpdate, hasChanges, changedModules, reset: resetChanged } = useTrackChanges()

    const onChange = useCallback((nextCanvas) => {
        // TODO set updated time
        // TODO do not save deleted canvases
        replaceCanvas(() => nextCanvas)
        resetChanged(nextCanvas)
    }, [replaceCanvas, resetChanged])

    useAutosaveEffect(onChange)

    const value = useMemo(() => ({
        hasChanges,
        changedModules,
        moduleNeedsUpdate,
        isAutosaving,
    }), [changedModules, isAutosaving, hasChanges, moduleNeedsUpdate])

    return (
        <AutosaveContext.Provider value={value}>
            {children}
        </AutosaveContext.Provider>
    )
}
