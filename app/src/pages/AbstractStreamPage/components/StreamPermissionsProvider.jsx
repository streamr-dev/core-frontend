import React, { useCallback, useState, useEffect, useRef } from 'react'
import { StreamPermission } from 'streamr-client'
import { useClient } from 'streamr-client-react'
import useRequireMounted from '$shared/hooks/useRequireMounted'
import UnmountedComponentError from '$shared/errors/UnmountedComponentError'
import NoClientError from '$shared/errors/NoClientError'
import NoStreamIdError from '$shared/errors/NoStreamIdError'
import useStreamId from '../hooks/useStreamId'
import StreamPermissionsContext from '../contexts/StreamPermissionsContext'
import StreamPermissionsReloaderContext from '../contexts/StreamPermissionsReloaderContext'

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

    const operationsRef = useRef(operations)

    const [permissions, setPermissions] = useState(getInitialPermissions(operationsRef.current))

    const client = useClient()

    const requireMounted = useRequireMounted()

    useEffect(() => {
        setPermissions(getInitialPermissions(operationsRef.current))
    }, [streamId])

    const reload = useCallback(async () => {
        if (!streamId) {
            throw new NoStreamIdError()
        }

        if (!client) {
            throw new NoClientError()
        }

        let remotePermissions = operationsRef.current.map(() => false)

        const user = await (async () => {
            try {
                return await client.getAddress()
            } catch (e) {
                // Noop.
            }

            return undefined
        })()

        requireMounted()

        try {
            remotePermissions = await Promise.all(operationsRef.current.map(async (permission) => {
                const publicallyPermitted = await (async () => {
                    if (permission !== StreamPermission.SUBSCRIBE) {
                        return false
                    }

                    try {
                        return await client.hasPermission({
                            public: true,
                            permission,
                            streamId,
                        })
                    } catch (e) {
                        console.error(e)
                    }

                    return false
                })()

                requireMounted()

                try {
                    return publicallyPermitted || await client.hasPermission({
                        permission,
                        streamId,
                        user,
                    })
                } catch (e) {
                    console.error(e)
                }

                return false
            }))
        } catch (e) {
            if (e instanceof UnmountedComponentError) {
                throw e
            }

            console.error(e)
        }

        requireMounted()

        return getPermissionsMap(operationsRef.current, (index) => (
            Boolean(remotePermissions[index])
        ))
    }, [requireMounted, client, streamId])

    const preloadRef = useRef(preload)

    useEffect(() => {
        let aborted = false

        async function fn() {
            try {
                const remotePermissions = await reload()

                if (aborted) {
                    return
                }

                setPermissions(remotePermissions)
            } catch (e) {
                if (!(e instanceof UnmountedComponentError)) {
                    console.error(e)
                }
            }
        }

        if (preloadRef.current) {
            // Load on mount!
            fn()
        }

        return () => {
            aborted = true
        }
    }, [reload, preload])

    return (
        <StreamPermissionsReloaderContext.Provider value={reload}>
            <StreamPermissionsContext.Provider value={permissions}>
                {children}
            </StreamPermissionsContext.Provider>
        </StreamPermissionsReloaderContext.Provider>
    )
}
