/**
 * Handles starting & stopping a canvas.
 */

import React, { useContext, useState, useCallback, useMemo } from 'react'
import get from 'lodash/get'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import * as SubscriptionStatus from '$editor/shared/components/SubscriptionStatus'
import { Context as PermissionContext } from '$editor/canvas/hooks/useCanvasPermissions'
import usePending from '$editor/shared/hooks/usePending'

import * as services from '../../services'
import * as CanvasState from '../../state'

import useCanvasStateChangeEffect from '../../hooks/useCanvasStateChangeEffect'
import useCanvasUpdater from './useCanvasUpdater'

export const RunControllerContext = React.createContext()

const EMPTY = {}

function isStateNotAllowedError(error) {
    if (!error) { return false }
    const errorData = get(error, 'response.data')
    return !!errorData && errorData.code === 'STATE_NOT_ALLOWED'
}

function useRunController(canvas = EMPTY) {
    const subscriptionStatus = useContext(SubscriptionStatus.Context)
    const { permissions } = useContext(PermissionContext)
    const { replaceCanvas } = useCanvasUpdater()
    const isMountedRef = useIsMountedRef()

    const createAdhocPending = usePending('CREATE ADHOC')
    const startPending = usePending('START')
    const stopPending = usePending('STOP')
    const exitPending = usePending('EXIT')
    const unlinkPending = usePending('UNLINK')

    const [isStarting, setIsStarting] = useState(false) // true immediately before starting a canvas
    const [isStopping, setIsStopping] = useState(false) // true immediately before stopping a canvas

    const isRunning = CanvasState.isRunning(canvas)
    const isHistorical = CanvasState.isHistoricalModeSelected(canvas)
    // true if canvas exists and is starting or already running
    const isActive = canvas !== EMPTY && (isStarting || isRunning)

    const hasSharePermission = permissions &&
        permissions.some((p) => p.operation === 'share')

    const hasWritePermission = permissions &&
        permissions.some((p) => p.operation === 'write')

    const isEditable = !isActive &&
        !canvas.adhoc &&
        hasWritePermission

    const start = useCallback(async (canvas, options) => {
        if (isHistorical && !canvas.adhoc) {
            const newCanvas = await createAdhocPending.wrap(() => services.createAdhocCanvas(canvas))
            if (!isMountedRef.current) { return }
            replaceCanvas(() => newCanvas)
            return
        }

        setIsStarting(true)

        if (isHistorical) {
            await subscriptionStatus.onAllReady()
        }

        if (!isMountedRef.current) { return canvas }
        const newCanvas = await startPending.wrap(() => services.start(canvas, {
            clearState: !!options.clearState || isHistorical,
        }))
            .catch((err) => {
                if (isStateNotAllowedError(err)) {
                    return // trying to start an already started canvas, ignore
                }

                if (isMountedRef.current) { setIsStarting(false) }
                throw err
            })

        if (!isMountedRef.current) { return }
        replaceCanvas(() => newCanvas)
    }, [subscriptionStatus, startPending, createAdhocPending, isHistorical, isMountedRef, replaceCanvas])

    const stop = useCallback(async (canvas) => {
        setIsStopping(true)
        return stopPending.wrap(() => services.stop(canvas))
            .catch((err) => {
                if (isStateNotAllowedError(err)) {
                    return // trying to stop an already stopped canvas, ignore
                }

                if (isMountedRef.current) { setIsStopping(false) }
                throw err
            })
    }, [stopPending, setIsStopping, isMountedRef])

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
    useCanvasStateChangeEffect(canvas, useCallback(() => setIsStarting(false), [setIsStarting]))
    // if state changes stopping must have ended
    useCanvasStateChangeEffect(canvas, useCallback(() => setIsStopping(false), [setIsStopping]))

    const isAnyPending = [
        createAdhocPending,
        startPending,
        stopPending,
        exitPending,
        unlinkPending,
    ].some(({ isPending }) => isPending)

    const isPending = !!(isStopping || isStarting || isAnyPending)

    return useMemo(() => ({
        isStarting,
        isStopping,
        isPending,
        canvas: canvas.id,
        isActive,
        isRunning,
        isHistorical,
        isEditable,
        hasSharePermission,
        hasWritePermission,
        start,
        stop,
        exit,
    }), [canvas, isPending, isStarting, isActive, isRunning, isHistorical, isEditable,
        hasSharePermission, hasWritePermission, isStopping, start, stop, exit])
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
