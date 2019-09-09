/**
 * Handles starting & stopping a canvas.
 */

import React, { useContext, useState, useCallback, useMemo } from 'react'
import get from 'lodash/get'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import * as SubscriptionStatus from '$editor/shared/components/SubscriptionStatus'
import usePending from '$shared/hooks/usePending'

import * as services from '../../services'
import * as CanvasState from '../../state'
import * as CanvasLinking from '../../state/linking'

import useCanvasStateChangeEffect from '../../hooks/useCanvasStateChangeEffect'
import useCanvasUpdater from './useCanvasUpdater'
import useEmbedMode from './useEmbedMode'
import useCanvasPermissions from './useCanvasPermissions'

export const RunControllerContext = React.createContext()

const EMPTY = {}

function isStateNotAllowedError(error) {
    if (!error) { return false }
    const errorData = get(error, 'response.data')
    return !!errorData && errorData.code === 'STATE_NOT_ALLOWED'
}

function useRunController(canvas = EMPTY) {
    const isEmbedMode = useEmbedMode()
    const subscriptionStatus = useContext(SubscriptionStatus.Context)
    const { hasWritePermission, hasSharePermission } = useCanvasPermissions()
    const { replaceCanvas } = useCanvasUpdater()
    const isMountedRef = useIsMountedRef()

    const createAdhocPending = usePending('canvas.CREATE ADHOC')
    const startPending = usePending('canvas.START')
    const stopPending = usePending('canvas.STOP')
    const exitPending = usePending('canvas.EXIT')
    const unlinkPending = usePending('canvas.UNLINK')
    const loadPending = usePending('canvas.LOAD')

    const [isStarting, setIsStarting] = useState(false) // true immediately before starting a canvas
    const [isStopping, setIsStopping] = useState(false) // true immediately before stopping a canvas

    const isRunning = CanvasState.isRunning(canvas)
    const isHistorical = CanvasState.isHistoricalModeSelected(canvas)
    // true if canvas exists and is starting or already running
    const isActive = canvas !== EMPTY && (isStarting || isRunning)

    // historical subscription should start as soon as starting.
    // realtime subscription starts after canvas is runnning
    const isSubscriptionActive = canvas.adhoc ? isActive : isRunning

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

    const unlinkParent = useCallback((canvas) => (
        unlinkPending.wrap(() => services.unlinkAndLoadParentCanvas(canvas))
    ), [unlinkPending])

    const stop = useCallback(async (canvas) => {
        setIsStopping(true)
        return stopPending.wrap(() => services.stop(canvas))
            .then(async (result) => {
                if (!result || !result.id) {
                    setIsStopping(false)
                    return
                }

                if (canvas.settings.parentCanvasId != null) {
                    CanvasLinking.unlink(canvas.settings.parentCanvasId) // remove link if exists
                }
                if (!isMountedRef.current) { return }
                setIsStopping(false)
                replaceCanvas(() => result)
            }, async (err) => {
                if (isStateNotAllowedError(err)) {
                    if (!canvas.adhoc) { return } // trying to stop an already stopped canvas, ignore
                    const parent = await unlinkParent(canvas) // ensure adhoc canvas gets unlinked
                    if (!isMountedRef.current) { return }
                    replaceCanvas(() => parent)
                    return
                }

                if (isMountedRef.current) { setIsStopping(false) }
                throw err
            })
    }, [stopPending, setIsStopping, isMountedRef, unlinkParent, replaceCanvas])

    const exit = useCallback(async (canvas) => {
        const newCanvas = await exitPending.wrap(() => unlinkParent(canvas))
        if (!isMountedRef.current) { return }
        replaceCanvas(() => newCanvas)
    }, [exitPending, replaceCanvas, unlinkParent, isMountedRef])

    const unlinkAdhocOnStop = useCallback(async (isRunning) => {
        if (isRunning || !canvas.adhoc || canvas.settings.parentCanvasId == null) { return }
        CanvasLinking.unlink(canvas.settings.parentCanvasId) // remove link on auto-stop
    }, [canvas])

    useCanvasStateChangeEffect(canvas, unlinkAdhocOnStop)

    // if state changes starting must have ended
    useCanvasStateChangeEffect(canvas, useCallback(() => setIsStarting(false), [setIsStarting]))
    // if state changes stopping must have ended
    useCanvasStateChangeEffect(canvas, useCallback(() => setIsStopping(false), [setIsStopping]))

    const isAnyPending = [
        loadPending,
        createAdhocPending,
        startPending,
        stopPending,
        exitPending,
        unlinkPending,
    ].some(({ isPending }) => isPending)

    const isPending = !!(isStopping || isStarting || isAnyPending)

    // e.g. move/resize but not commit
    const isAdjustable = !isPending

    // write commits
    const isEditable = (
        !isEmbedMode &&
        !isActive &&
        isAdjustable &&
        !canvas.adhoc &&
        hasWritePermission
    )

    // controls whether user can currently start/stop canvas
    const canChangeRunState = (
        !isEmbedMode && // can't change run state when in embed mode
        !isPending && // no pending
        hasWritePermission && ( // has write perms
            // check historical settings ok if historical
            !isHistorical ||
            // don't prevent stopping running canvas if not valid
            isRunning ||
            CanvasState.isHistoricalRunValid(canvas)
        )
    )

    return useMemo(() => ({
        canChangeRunState,
        isStarting,
        isStopping,
        isPending,
        canvas: canvas.id,
        isActive,
        isRunning,
        isHistorical,
        isAdjustable,
        isEditable,
        isSubscriptionActive,
        hasSharePermission,
        hasWritePermission,
        start,
        stop,
        exit,
    }), [canvas, isPending, isStarting, isActive, isRunning, isHistorical, isEditable, isAdjustable,
        hasSharePermission, hasWritePermission, isStopping, start, stop, exit, canChangeRunState, isSubscriptionActive])
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
