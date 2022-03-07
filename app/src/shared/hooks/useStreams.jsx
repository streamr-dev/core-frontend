import { useEffect, useState } from 'react'
import { useClient } from 'streamr-client-react'
import getClientAddress from '$app/src/getters/getClientAddress'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import StaleError from '$shared/errors/StaleError'

export default function useStreams(search) {
    const [streams, setStreams] = useState(undefined)

    const client = useClient()

    useEffect(() => {
        let stale = false

        function requireFresh() {
            if (stale) {
                throw new StaleError()
            }
        }

        async function fn() {
            const newStreams = []

            try {
                const user = await getClientAddress(client, {
                    suppressFailures: true,
                })

                requireFresh()

                const gen = client.searchStreams(search, {
                    user,
                })

                // eslint-disable-next-line no-restricted-syntax
                for await (const stream of gen) {
                    requireFresh()
                    newStreams.push(stream)
                }

                requireFresh()

                setStreams(newStreams)
            } catch (e) {
                if (e instanceof StaleError) {
                    return
                }

                console.warn(e)

                Notification.push({
                    title: 'Failed to fetch streams',
                    icon: NotificationIcon.ERROR,
                })
            }
        }

        fn()

        return () => {
            stale = true
        }
    }, [client, search])

    return streams
}
