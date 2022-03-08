import { useCallback } from 'react'
import { StreamPermission } from 'streamr-client'
import { useClient } from 'streamr-client-react'
import NoClientError from '$shared/errors/NoClientError'
import NoStreamIdError from '$shared/errors/NoStreamIdError'
import getClientAddress from '$app/src/getters/getClientAddress'
import useFresh from '$shared/hooks/useFresh'

export default function useFetchPermission() {
    const client = useClient()

    const fresh = useFresh()

    return useCallback(async (streamId, permission) => {
        const { requireFresh } = fresh(`${streamId}/${permission}`)

        if (!client) {
            throw new NoClientError()
        }

        const user = await getClientAddress(client, {
            suppressFailures: true,
        })

        requireFresh()

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

        requireFresh()

        return false
    }, [fresh, client])
}
