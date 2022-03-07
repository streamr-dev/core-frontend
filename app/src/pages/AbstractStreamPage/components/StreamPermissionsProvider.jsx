import React, { useState, useEffect, useRef, useReducer } from 'react'
import { StreamPermission } from 'streamr-client'
import { useClient } from 'streamr-client-react'
import StaleError from '$shared/errors/StaleError'
import NoClientError from '$shared/errors/NoClientError'
import NoStreamIdError from '$shared/errors/NoStreamIdError'
import getClientAddress from '$app/src/getters/getClientAddress'
import useStreamId from '../hooks/useStreamId'
import StreamPermissionsContext from '../contexts/StreamPermissionsContext'
import StreamPermissionsInvalidatorContext from '../contexts/StreamPermissionsInvalidatorContext'

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

    // 0 `cache` means we're not gonna run the permission fetching logic down the pipe. `preload` is
    // a on-mount only thing by design.
    const [cache, invalidate] = useReducer((current) => current + 1, Number(!!preload))

    const client = useClient()

    useEffect(() => {
        setPermissions(getInitialPermissions(operationsRef.current))
    }, [streamId])

    useEffect(() => {
        let stale = false

        function requireFresh() {
            if (stale) {
                throw new StaleError()
            }
        }

        async function fn() {
            try {
                if (!streamId) {
                    throw new NoStreamIdError()
                }

                if (!client) {
                    throw new NoClientError()
                }

                let remotePermissions = operationsRef.current.map(() => false)

                const user = await getClientAddress(client, {
                    suppressFailures: true,
                })

                remotePermissions = await Promise.all(operationsRef.current.map(async (permission) => {
                    requireFresh()

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

                    requireFresh()

                    try {
                        return publicallyPermitted || await client.hasPermission({
                            permission,
                            streamId,
                            user,
                        })
                    } catch (e) {
                        console.warn(e)
                    }

                    return false
                }))

                requireFresh()

                setPermissions(getPermissionsMap(operationsRef.current, (index) => (
                    Boolean(remotePermissions[index])
                )))
            } catch (e) {
                if (e instanceof StaleError) {
                    return
                }

                throw e
            }
        }

        if (cache > 0) {
            fn()
        }

        return () => {
            stale = true
        }
    }, [client, streamId, cache])

    return (
        <StreamPermissionsInvalidatorContext.Provider value={invalidate}>
            <StreamPermissionsContext.Provider value={permissions}>
                {children}
            </StreamPermissionsContext.Provider>
        </StreamPermissionsInvalidatorContext.Provider>
    )
}
