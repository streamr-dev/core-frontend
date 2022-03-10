import { useCallback, useEffect } from 'react'
import { StreamPermission } from 'streamr-client'
import { useClient } from 'streamr-client-react'
import NoClientError from '$shared/errors/NoClientError'
import NoStreamIdError from '$shared/errors/NoStreamIdError'
import getClientAddress from '$app/src/getters/getClientAddress'
import useInterrupt from '$shared/hooks/useInterrupt'

export default function useFetchPermission() {
    const client = useClient()

    const itp = useInterrupt()

    useEffect(() => {
        itp().interruptAll()
    }, [itp, client])

    return useCallback(async (streamId, permission) => {
        const { requireUninterrupted } = itp(`${streamId}/${permission}`)

        if (!client) {
            throw new NoClientError()
        }

        const user = await getClientAddress(client, {
            suppressFailures: true,
        })

        requireUninterrupted()

        if (!streamId) {
            throw new NoStreamIdError()
        }

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

        requireUninterrupted()

        try {
            return publicallyPermitted || await client.hasPermission({
                permission,
                streamId,
                user,
            })
        } catch (e) {
            console.warn(e)
        }

        requireUninterrupted()

        return false
    }, [itp, client])
}
