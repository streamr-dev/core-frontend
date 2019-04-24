/**
 * Handles starting & stopping a canvas.
 */

import React, { useContext, useState, useCallback, useMemo } from 'react'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import * as SubscriptionStatus from '$editor/shared/components/SubscriptionStatus'
import * as services from '../services'
import * as CanvasState from '../state'

import useCanvasStateChangeEffect from '../hooks/useCanvasStateChangeEffect'

export const RunControllerContext = React.createContext()

const EMPTY = {}

function useRunController(canvas = EMPTY) {
    const subscriptionStatus = useContext(SubscriptionStatus.Context)
    const isMountedRef = useIsMountedRef()

    const [state, setState] = useState({
        isStarting: false, // true immediately before starting a canvas
        isPending: false, // true when async operation in action
    })

    // pending state helper
    const setPending = useCallback((isPending) => {
        if (!isMountedRef.current) { return }
        setState((state) => {
            if (state.isPending === isPending) { return null } // do nothing if already set
            return {
                ...state,
                isPending,
            }
        })
    }, [setState, isMountedRef])

    const endIsStarting = useCallback(() => {
        if (!isMountedRef.current) { return }
        if (!state.isStarting) { return }
        setState((state) => ({
            ...state,
            isStarting: false,
        }))
    }, [state.isStarting, isMountedRef])

    const isRunning = CanvasState.isRunning(canvas)
    const isHistorical = CanvasState.isHistoricalModeSelected(canvas)
    // true if canvas exists and is starting or already running
    const isActive = canvas !== EMPTY && (state.isStarting || isRunning)

    const start = useCallback(async (canvas, options) => {
        if (isHistorical && !canvas.adhoc) {
            setPending('CREATE ADHOC')
            return services.createAdhocCanvas(canvas)
                .finally(() => setPending(false))
        }

        // set both at once to prevent any side effects
        // due to one or other being missing
        setState({
            isPending: 'START',
            isStarting: true,
        })

        if (isHistorical) {
            await subscriptionStatus.onAllReady()
        }

        if (!isMountedRef.current) { return canvas }
        return services.start(canvas, {
            clearState: !!options.clearState || isHistorical,
        })
            .catch((err) => {
                endIsStarting()
                throw err
            })
            .finally(() => {
                setPending(false)
            })
    }, [subscriptionStatus, setState, setPending, isHistorical, endIsStarting, isMountedRef])

    const stop = useCallback((canvas) => {
        setPending('STOP')
        return services.stop(canvas)
            .finally(() => setPending(false))
    }, [setPending])

    const exit = useCallback((canvas) => {
        setPending('EXIT')
        return services.loadParentCanvas(canvas)
            .finally(() => setPending(false))
    }, [setPending])

    const unlinkAdhocOnStop = useCallback((isRunning) => {
        if (isRunning || !canvas.adhoc) { return }
        setPending('UNLINK')
        return services.unlinkParentCanvas(canvas)
            .finally(() => setPending(false))
    }, [canvas, setPending])

    useCanvasStateChangeEffect(canvas, unlinkAdhocOnStop)

    // if state changes starting must have ended
    useCanvasStateChangeEffect(canvas, endIsStarting)

    return useMemo(() => ({
        ...state,
        isPending: !!state.isPending,
        canvas: canvas.id,
        isActive,
        isRunning,
        isHistorical,
        start,
        stop,
        exit,
    }), [canvas, isActive, isRunning, isHistorical, state, start, stop, exit])
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
