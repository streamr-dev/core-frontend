/**
 * Handles starting & stopping a canvas.
 */

import React, { useContext, useState, useCallback, useMemo } from 'react'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import * as SubscriptionStatus from '$editor/shared/components/SubscriptionStatus'
import * as services from '../../services'
import * as CanvasState from '../../state'

import useCanvasStateChangeEffect from '../../hooks/useCanvasStateChangeEffect'
import useCanvasUpdater from './useCanvasUpdater'
import usePending from './usePending'

export const RunControllerContext = React.createContext()

const EMPTY = {}

function useRunController(canvas = EMPTY) {
    const subscriptionStatus = useContext(SubscriptionStatus.Context)
    const { replaceCanvas } = useCanvasUpdater()
    const isMountedRef = useIsMountedRef()

    const [isStarting, setIsStarting] = useState(false) // true immediately before starting a canvas

    const endIsStarting = useCallback(() => {
        if (!isMountedRef.current) { return }
        setIsStarting(false)
    }, [isMountedRef, setIsStarting])

    const isRunning = CanvasState.isRunning(canvas)
    const isHistorical = CanvasState.isHistoricalModeSelected(canvas)
    // true if canvas exists and is starting or already running
    const isActive = canvas !== EMPTY && (isStarting || isRunning)

    const createAdhocPending = usePending('CREATE ADHOC')
    const startPending = usePending('START')
    const stopPending = usePending('STOP')
    const exitPending = usePending('EXIT')
    const unlinkPending = usePending('UNLINK')

    const start = useCallback(async (canvas, options) => {
        if (isHistorical && !canvas.adhoc) {
            const newCanvas = await createAdhocPending.wrap(() => services.createAdhocCanvas(canvas))
            if (!isMountedRef.current) { return }
            replaceCanvas(() => newCanvas)
            return
        }

        setIsStarting(true)

        if (isHistorical) {
            subscriptionStatus.onAllReady()
        }

        if (!isMountedRef.current) { return canvas }
        const newCanvas = await startPending.wrap(() => services.start(canvas, {
            clearState: !!options.clearState || isHistorical,
        }))
            .catch((err) => {
                endIsStarting()
                throw err
            })

        if (!isMountedRef.current) { return }
        replaceCanvas(() => newCanvas)
    }, [subscriptionStatus, startPending, createAdhocPending, isHistorical, endIsStarting, isMountedRef, replaceCanvas])

    const stop = useCallback(async (canvas) => (
        stopPending.wrap(() => services.stop(canvas))
    ), [stopPending])

    const exit = useCallback(async (canvas) => {
        const newCanvas = await exitPending.wrap(() => services.loadParentCanvas(canvas))
        if (!isMountedRef.current) { return }
        replaceCanvas(() => newCanvas)
    }, [exitPending, replaceCanvas, isMountedRef])

    const unlinkAdhocOnStop = useCallback(async (isRunning) => {
        if (isRunning || !canvas.adhoc) { return }
        await unlinkPending.wrap(() => services.unlinkParentCanvas(canvas))
    }, [canvas, unlinkPending])

    useCanvasStateChangeEffect(canvas, unlinkAdhocOnStop)

    // if state changes starting must have ended
    useCanvasStateChangeEffect(canvas, endIsStarting)

    const isPending = [
        createAdhocPending,
        startPending,
        stopPending,
        exitPending,
        unlinkPending,
    ].some(({ isPending }) => isPending)

    return useMemo(() => ({
        isStarting,
        isPending,
        canvas: canvas.id,
        isActive,
        isRunning,
        isHistorical,
        start,
        stop,
        exit,
    }), [canvas, isPending, isStarting, isActive, isRunning, isHistorical, start, stop, exit])
}

export default function RunControllerProvider({ children, canvas }) {
    return (
        <RunControllerContext.Provider value={useRunController(canvas)}>
            {children || null}
        </RunControllerContext.Provider>
    )
}

export {
    RunControllerContext as Context,
    RunControllerProvider as Provider,
}
