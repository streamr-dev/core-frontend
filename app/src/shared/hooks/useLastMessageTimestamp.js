import { useEffect, useState } from 'react'
import { useClient } from 'streamr-client-react'
import useIsMounted from '$shared/hooks/useIsMounted'

const useLastMessageTimestamp = (streamId) => {
    const client = useClient()

    const [timestamp, setTimestamp] = useState(undefined)

    const isMounted = useIsMounted()

    useEffect(() => {
        if (!client) {
            return () => {}
        }

        let last

        const onMessage = (_, { messageId: { timestamp: ts } }) => {
            last = ts
        }

        const sub = (() => {
            try {
                return client.subscribe({
                    stream: streamId,
                    resend: {
                        last: 1,
                    },
                }, onMessage)
            } catch (e) { /**/ }

            return null
        })()

        const onResendDone = () => {
            if (isMounted()) {
                setTimestamp(last)
            }

            sub.off('initial_resend_done', onResendDone)
            client.unsubscribe(sub)
        }

        if (sub) {
            sub.on('initial_resend_done', onResendDone)
        }

        return () => {
            if (sub) {
                sub.off('initial_resend_done', onResendDone)
                client.unsubscribe(sub)
            }
        }
    }, [client, streamId, isMounted])

    return timestamp
}

export default useLastMessageTimestamp
