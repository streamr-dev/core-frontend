/**
 * Enables waiting for all registered subscriptions to be subscribed.
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'

export const SubscriptionStatusContext = React.createContext({})

function getPromiseResolver() {
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

export default function SubscriptionStatusProvider({ children }) {
    const [subscriptions, setSubscriptions] = useState({})

    const isMountedRef = useRef(true)

    useEffect(() => () => {
        isMountedRef.current = false
    }, [])

    const unregister = useCallback((uid) => {
        if (!isMountedRef.current) { return }
        if (subscriptions[uid] == null) { return }
        const nextState = { ...subscriptions }
        delete nextState[uid]
        setSubscriptions(nextState)
    }, [subscriptions, setSubscriptions])

    const register = useCallback((uid) => {
        if (!isMountedRef.current) { return }
        // noop if already have subscription
        if (subscriptions[uid] != null) { return }
        setSubscriptions({
            ...subscriptions,
            [uid]: false,
        })
    }, [subscriptions, setSubscriptions])

    const unsubscribed = useCallback((uid) => {
        if (!isMountedRef.current) { return }
        // noop if don't have subscription or already unsubscribed
        if (!subscriptions[uid]) { return }
        setSubscriptions({
            ...subscriptions,
            [uid]: false,
        })
    }, [subscriptions, setSubscriptions])

    const subscribed = useCallback((uid) => {
        if (!isMountedRef.current) { return }
        // noop if already subscribed
        if (subscriptions[uid]) { return }
        setSubscriptions({
            ...subscriptions,
            [uid]: true,
        })
    }, [subscriptions, setSubscriptions])

    const subscriptionIds = Object.keys(subscriptions)
    const allReady = !!(subscriptionIds.length && subscriptionIds.every((key) => subscriptions[key]))

    const onAllReadyRef = useRef()
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

    const onAllReady = useCallback(() => {
        if (allReady || !isMountedRef.current) {
            return Promise.resolve()
        }

        if (!onAllReadyRef.current) {
            onAllReadyRef.current = getPromiseResolver() // reset
        }
        return onAllReadyRef.current.promise
    }, [allReady])

    const subscriptionStatus = useMemo(() => ({
        onAllReady,
        allReady,
        register,
        unregister,
        subscribed,
        unsubscribed,
    }), [onAllReady, allReady, register, unregister, subscribed, unsubscribed])

    return (
        <SubscriptionStatusContext.Provider value={subscriptionStatus}>
            {children || null}
        </SubscriptionStatusContext.Provider>
    )
}

export {
    SubscriptionStatusProvider as Provider,
    SubscriptionStatusContext as Context,
}
