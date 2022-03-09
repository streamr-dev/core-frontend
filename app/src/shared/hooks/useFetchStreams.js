import { useCallback, useEffect } from 'react'
import { useClient } from 'streamr-client-react'
import getClientAddress from '$app/src/getters/getClientAddress'
import useInterrupt from '$shared/hooks/useInterrupt'

export default function useFetchStreams() {
    const client = useClient()

    const itp = useInterrupt()

    useEffect(() => {
        itp().interruptAll()
    }, [itp, client])

    return useCallback(async (search) => {
        const { requireUninterrupted } = itp(search)

        const newStreams = []

        const user = await getClientAddress(client, {
            suppressFailures: true,
        })

        requireUninterrupted()

        const gen = client.searchStreams(search, {
            user,
        })

        // eslint-disable-next-line no-restricted-syntax
        for await (const stream of gen) {
            requireUninterrupted()
            newStreams.push(stream)
        }

        return newStreams
    }, [client, itp])
}
