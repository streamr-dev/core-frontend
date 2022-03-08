import React, { useState, useEffect, useRef, useReducer } from 'react'
import InterruptionError from '$shared/errors/InterruptionError'
import StreamPermissionsContext from '$shared/contexts/StreamPermissionsContext'
import StreamPermissionsInvalidatorContext from '$shared/contexts/StreamPermissionsInvalidatorContext'
import useStreamId from '$shared/hooks/useStreamId'
import useFetchPermission from '$shared/hooks/useFetchPermission'
import useInterrupt from '$shared/hooks/useInterrupt'

function getPermissionsMap(operations, formatFn) {
    const result = {}

    operations.forEach((operation, index) => {
        result[operation] = formatFn(index)
    })

    return result
}

function getInitialPermissions(operations) {
    return getPermissionsMap(operations, () => undefined)
}

export default function StreamPermissionsProvider({ children, preload = false, operations }) {
    const streamId = useStreamId()

    // By design `operations` stay the same thoughout the life cycle of this component.
    const operationsRef = useRef(operations)

    const [permissions, setPermissions] = useState(getInitialPermissions(operationsRef.current))

    // 0 `cache` means we're not gonna run the permission fetching logic down the mounting
    // pipe. `preload` is a on-mount only thing by design.
    const [cache, invalidate] = useReducer((current) => current + 1, Number(!!preload))

    useEffect(() => {
        setPermissions(getInitialPermissions(operationsRef.current))
    }, [streamId])

    const fetchPermission = useFetchPermission()

    const itp = useInterrupt()

    useEffect(() => {
        const { requireUninterrupted, interrupt } = itp()

        async function fn() {
            try {
                const remotePermissions = await Promise.all(operationsRef.current.map((permission) => (
                    fetchPermission(streamId, permission)
                )))

                requireUninterrupted()

                setPermissions(getPermissionsMap(operationsRef.current, (index) => (
                    Boolean(remotePermissions[index])
                )))
            } catch (e) {
                console.warn(e)

                if (e instanceof InterruptionError) {
                    return
                }

                throw e
            }
        }

        if (cache > 0) {
            fn()
        }

        return () => {
            interrupt()
        }
    }, [itp, fetchPermission, cache, streamId])

    return (
        <StreamPermissionsInvalidatorContext.Provider value={invalidate}>
            <StreamPermissionsContext.Provider value={permissions}>
                {children}
            </StreamPermissionsContext.Provider>
        </StreamPermissionsInvalidatorContext.Provider>
    )
}
