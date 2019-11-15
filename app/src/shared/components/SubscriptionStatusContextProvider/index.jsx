// @flow

/**
 * Enables waiting for all registered subscriptions to be subscribed.
 */

import React, { type Context, type Node, useState, useCallback, useMemo, useEffect, useRef } from 'react'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'

type ContextProps = {
    onAllReady: Function,
    allReady: boolean,
    register: Function,
    unregister: Function,
    subscribed: Function,
    unsubscribed: Function,
}

export const SubscriptionStatusContext: Context<ContextProps> = React.createContext({})

type PromiseResolver = {
    resolved?: boolean,
    promise: Promise<any>,
    resolve: Function,
    reject: Function,
}

type ReadyRef = {
    current: ?PromiseResolver,
}

/**
 * Returns a promise + its resolve/reject functions
 */

function getPromiseResolver(): PromiseResolver {
    let resolver
    let rejector
    const promise = new Promise((resolve, reject) => {
        resolver = resolve
        rejector = reject
    })
    return {
        promise,
        resolve: resolver,
        reject: rejector,
    }
}

/**
 * Creates an async callback which resolves when all subscriptions are ready
 */

function useAllReady(subscriptions) {
    const isMountedRef = useIsMountedRef()
    const subscriptionIds = Object.keys(subscriptions)
    const allReady = !!(subscriptionIds.length && subscriptionIds.every((key) => subscriptions[key]))

    const onAllReadyRef: ReadyRef = useRef()
    useEffect(() => {
        if (allReady && onAllReadyRef.current) {
            onAllReadyRef.current.resolved = true
            onAllReadyRef.current.resolve() // resolve
            onAllReadyRef.current = undefined
        }
        return () => {
            if (onAllReadyRef.current) {
                onAllReadyRef.current.resolve()
                onAllReadyRef.current = undefined
            }
        }
    }, [allReady])

    const onAllReady = useCallback(async () => {
        if (allReady || !isMountedRef.current) {
            return () => {} // resolve immediately
        }

        if (!onAllReadyRef.current) {
            // reset
            onAllReadyRef.current = getPromiseResolver()
        }
        // wait for resolve
        return onAllReadyRef.current.promise
    }, [allReady, isMountedRef])

    return [onAllReady, allReady]
}

function useSubscriptionStatus() {
    const [subscriptions, setSubscriptions] = useState({})

    const [onAllReady, allReady] = useAllReady(subscriptions)

    const unregister = useCallback((uid) => {
        if (subscriptions[uid] == null) { return }
        const nextState = {
            ...subscriptions,
        }
        delete nextState[uid]
        setSubscriptions(nextState)
    }, [subscriptions, setSubscriptions])

    const register = useCallback((uid) => {
        // noop if already have subscription
        if (subscriptions[uid] != null) { return }
        setSubscriptions({
            ...subscriptions,
            [uid]: false,
        })
    }, [subscriptions, setSubscriptions])

    const unsubscribed = useCallback((uid) => {
        // noop if don't have subscription or already unsubscribed
        if (!subscriptions[uid]) { return }
        setSubscriptions({
            ...subscriptions,
            [uid]: false,
        })
    }, [subscriptions, setSubscriptions])

    const subscribed = useCallback((uid) => {
        // noop if already subscribed
        if (subscriptions[uid]) { return }
        setSubscriptions({
            ...subscriptions,
            [uid]: true,
        })
    }, [subscriptions, setSubscriptions])

    return useMemo(() => ({
        onAllReady,
        allReady,
        register,
        unregister,
        subscribed,
        unsubscribed,
    }), [onAllReady, allReady, register, unregister, subscribed, unsubscribed])
}

type Props = {
    children?: Node,
}

export default function SubscriptionStatusProvider({ children }: Props) {
    return (
        <SubscriptionStatusContext.Provider value={useSubscriptionStatus()}>
            {children || null}
        </SubscriptionStatusContext.Provider>
    )
}

export {
    SubscriptionStatusProvider as Provider,
    SubscriptionStatusContext as Context,
}
