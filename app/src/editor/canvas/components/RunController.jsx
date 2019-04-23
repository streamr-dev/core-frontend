/**
 * Handles starting & stopping a canvas.
 */

import React, { useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react'

import * as SubscriptionStatus from '$editor/shared/components/SubscriptionStatus'
import * as services from '../services'
import * as CanvasState from '../state'

export const RunControllerContext = React.createContext()

function useRunController(canvas) {
    const subscriptionStatus = useContext(SubscriptionStatus.Context)
    const isMountedRef = useRef(true)

    useEffect(() => () => {
        isMountedRef.current = false
    }, [])

    const [state, setState] = useState({
        isStarting: false, // true immediately before starting a canvas
        isPending: false, // true when async operation in action
    })

    // pending state helper
    const setPending = useCallback((isPending) => setState((state) => ({
        ...state,
        isPending,
    })), [setState])

    const canvasRunState = canvas && canvas.state

    const isRunning = canvasRunState === CanvasState.RunStates.Running
    const isHistorical = CanvasState.isHistoricalModeSelected(canvas)
    // true if canvas exists and is starting or already running
    const isActive = !!(canvas && (state.isStarting || isRunning))

    useEffect(() => () => {
        if (isRunning) {
            // run in an effect to ensure canvas being rendered is running
            setState({
                isStarting: false,
            })
        }
    }, [isRunning, setState])

    const start = useCallback(async (canvas, options) => {
        if (isHistorical && !canvas.adhoc) {
            setPending(true)
            return services.createAdhocCanvas(canvas)
                .finally(() => setPending(false))
        }

        // set both at once to prevent any side effects
        // due to one or other being missing
        setState({
            isPending: true,
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
                setState({
                    isStarting: false,
                })
                throw err
            })
            .finally(() => setPending(false))
    }, [subscriptionStatus, setState, setPending, isHistorical])

    const stop = useCallback((canvas) => {
        setPending(true)
        return services.stop(canvas)
            .finally(() => setPending(false))
    }, [setPending])

    const exit = useCallback((canvas) => {
        setPending(true)
        return services.exitAdhocCanvas(canvas)
            .finally(() => setPending(false))
    }, [setPending])

    return useMemo(() => ({
        ...state,
        canvas: canvas && canvas.id,
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
