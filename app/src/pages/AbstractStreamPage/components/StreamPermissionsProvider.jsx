import React, { useCallback, useState, useEffect } from 'react'
import { StreamPermission } from 'streamr-client'
import { useClient } from 'streamr-client-react'
import useRequireMounted from '$shared/hooks/useRequireMounted'
import UnmountedComponentError from '$shared/errors/UnmountedComponentError'
import NoClientError from '$shared/errors/NoClientError'
import NoStreamIdError from '$shared/errors/NoStreamIdError'
import useStreamId from '../hooks/useStreamId'
import StreamPermissionsContext, { initialPermissions } from '../contexts/StreamPermissionsContext'
import StreamPermissionsReloaderContext from '../contexts/StreamPermissionsReloaderContext'

const OPERATIONS = Object.keys(initialPermissions)

export default function StreamPermissionsProvider({ children }) {
    const streamId = useStreamId()

    const [permissions, setPermissions] = useState(initialPermissions)

    const client = useClient()

    const requireMounted = useRequireMounted()

    useEffect(() => {
        setPermissions(initialPermissions)
    }, [streamId])

    const reload = useCallback(async () => {
        if (!streamId) {
            throw new NoStreamIdError()
        }

        if (!client) {
            throw new NoClientError()
        }

        let remotePermissions = OPERATIONS.map(() => false)

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
            remotePermissions = await Promise.all(OPERATIONS.map(async (permission) => {
                const publicallyPermitted = await (async () => {
                    try {
                        if (permission !== StreamPermission.SUBSCRIBE) {
                            throw new Error(`Only "${StreamPermission.SUBSCRIBE}" can be public`)
                        }

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

        const result = {}

        OPERATIONS.forEach((operation, index) => {
            result[operation] = Boolean(remotePermissions[index])
        })

        return result
    }, [requireMounted, client, streamId])

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

        fn()

        return () => {
            aborted = true
        }
    }, [reload])

    return (
        <StreamPermissionsReloaderContext.Provider value={reload}>
            <StreamPermissionsContext.Provider value={permissions}>
                {children}
            </StreamPermissionsContext.Provider>
        </StreamPermissionsReloaderContext.Provider>
    )
}
