/**
 * Provides a shared streamr-client instance.
 */

/* eslint-disable react/no-unused-state */

import React, { useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react'

export const RunControllerContext = React.createContext()

import * as SubscriptionStatus from '$editor/shared/components/SubscriptionStatus'
import * as services from '../services'
import * as CanvasState from '../state'

function useRunController(canvas) {
    const subscriptionStatus = useContext(SubscriptionStatus.Context)
    const isMountedRef = useRef(true)

    useEffect(() => () => {
        isMountedRef.current = false
    }, [])

    const [state, setState] = useState({
        isStarting: false,
        isPending: false,
    })

    const setPending = useCallback((isPending) => setState((state) => ({
        ...state,
        isPending,
    })), [setState])

    useEffect(() => () => {
        if (canvas.state === CanvasState.RunStates.Running) {
            setState({
                isStarting: false,
            })
        }
    }, [canvas && canvas.state, setState, setPending])

    const start = useCallback(async (canvas, options) => {
        const isHistorical = CanvasState.isHistoricalModeSelected(canvas)
        if (isHistorical && !canvas.adhoc) {
            setPending(true)
            return services.createAdhocCanvas(canvas)
        }

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
    }, [setState, subscriptionStatus, setPending])

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

    const isActive = !!(canvas && (state.isStarting || canvas.state === CanvasState.RunStates.Running))

    return useMemo(() => ({
        ...state,
        canvas: canvas && canvas.id,
        isActive,
        start,
        stop,
        exit,
    }), [canvas, isActive, state, start, stop, exit])
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
