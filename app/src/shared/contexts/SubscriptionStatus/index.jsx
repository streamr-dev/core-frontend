// @flow

/**
 * Enables waiting for all registered subscriptions to be subscribed.
 */

import React, { type Context, type Node, useState, useCallback, useMemo, useEffect, useRef } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'

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
    const isMounted = useIsMounted()
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
        if (allReady || !isMounted()) {
            return () => {} // resolve immediately
        }

        if (!onAllReadyRef.current) {
            // reset
            onAllReadyRef.current = getPromiseResolver()
        }
        // wait for resolve
        return onAllReadyRef.current.promise
    }, [allReady, isMounted])

    return [onAllReady, allReady]
}

function useSubscriptionStatus() {
    const isMounted = useIsMounted()

    const [subscriptions, setSubscriptions] = useState({})

    const [onAllReady, allReady] = useAllReady(subscriptions)

    const unregister = useCallback((uid) => {
        if (!isMounted()) { return }
        setSubscriptions((currentSubscriptions) => {
            if (currentSubscriptions[uid] == null) { return currentSubscriptions }
            const nextState = {
                ...currentSubscriptions,
            }
            delete nextState[uid]
            return nextState
        })
    }, [setSubscriptions, isMounted])

    const register = useCallback((uid) => {
        // noop if already have subscription
        if (!isMounted()) { return }

        setSubscriptions((currentSubscriptions) => {
            if (currentSubscriptions[uid] != null) { return currentSubscriptions }
            return {
                ...currentSubscriptions,
                [uid]: false,
            }
        })
    }, [setSubscriptions, isMounted])

    const unsubscribed = useCallback((uid) => {
        // noop if don't have subscription or already unsubscribed
        if (!isMounted()) { return }

        setSubscriptions((currentSubscriptions) => {
            if (!currentSubscriptions[uid]) { return currentSubscriptions }
            return {
                ...currentSubscriptions,
                [uid]: false,
            }
        })
    }, [setSubscriptions, isMounted])

    const subscribed = useCallback((uid) => {
        // noop if already subscribed
        if (!isMounted()) { return }
        setSubscriptions((currentSubscriptions) => {
            if (currentSubscriptions[uid]) { return currentSubscriptions }
            return {
                ...currentSubscriptions,
                [uid]: true,
            }
        })
    }, [setSubscriptions, isMounted])
    const subStateRef = useRef(subscriptions)
    useEffect(() => {
        subStateRef.current = subscriptions
    }, [subscriptions])

    const getSubscriptions = useCallback(() => (
        subStateRef.current
    ), [])

    return useMemo(() => ({
        getSubscriptions,
        onAllReady,
        allReady,
        register,
        unregister,
        subscribed,
        unsubscribed,
    }), [getSubscriptions, onAllReady, allReady, register, unregister, subscribed, unsubscribed])
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
