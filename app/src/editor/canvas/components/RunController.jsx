/**
 * Provides a shared streamr-client instance.
 */

/* eslint-disable react/no-unused-state */

import React, { useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react'

export const RunControllerContext = React.createContext()

import * as SubscriptionStatus from '$editor/shared/components/SubscriptionStatus'
import * as services from '../services'
import * as CanvasState from '../state'

function useRunMachine(canvas) {
    const subscriptionStatus = useContext(SubscriptionStatus.Context)
    const isMountedRef = useRef(true)

    useEffect(() => () => {
        isMountedRef.current = false
    }, [])

    const [state, setState] = useState({})

    const start = useCallback(async (canvas, options) => {
        const isHistorical = CanvasState.isHistoricalModeSelected(canvas)
        if (isHistorical && !canvas.adhoc) {
            return services.createAdhocCanvas(canvas)
        }
        setState({
            isStarting: true,
        })
        if (isHistorical) {
            await subscriptionStatus.onAllReady()
        }
        if (!isMountedRef.current) { return canvas }
        return services.start(canvas, {
            clearState: !!options.clearState || isHistorical,
        })
    }, [state, setState, subscriptionStatus, canvas])

    useEffect(() => {
        if (canvas.state === CanvasState.RunStates.Running) {
            setState({
                isStarting: false,
            })
        }
    }, canvas && canvas.state)

    const stop = useCallback((canvas) => (
        services.stop(canvas)
    ), [])

    const isActive = !!(canvas && (state.isStarting || canvas.state === CanvasState.RunStates.Running))

    return useMemo(() => ({
        ...state,
        canvas: canvas && canvas.id,
        isActive,
        start,
        stop,
    }), [canvas && canvas.id, isActive, state, start, stop])
}

export default function RunControllerProvider({ children, canvas }) {
    return (
        <RunControllerContext.Provider value={useRunMachine(canvas)}>
            {children || null}
        </RunControllerContext.Provider>
    )
}

export {
    RunControllerContext as Context,
    RunControllerProvider as Provider,
}
