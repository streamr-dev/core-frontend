import { useState, useRef, useEffect } from 'react'
import { useSubscription } from 'streamr-client-react'
import useIsMounted from '$shared/hooks/useIsMounted'
import { Message } from '$shared/utils/SubscriptionEvents'

function getEmptyData() {
    return []
}

function areMessagesSame(a, b) {
    return a.toMessageRef().compareTo(b.toMessageRef()) === 0
}

const LOCAL_DATA_LIST_LENGTH = 20

export default function useStreamData(streamId, partition) {
    const isMounted = useIsMounted()

    const cacheRef = useRef(getEmptyData())

    const [data, setData] = useState(getEmptyData())

    useSubscription({
        stream: streamId,
        partition,
        resend: {
            last: LOCAL_DATA_LIST_LENGTH,
        },
    }, {
        onMessage(message, metadata) {
            if (!isMounted()) {
                return
            }

            switch (data.type) {
                case Message.Done:
                case Message.Notification:
                case Message.Warning:
                case Message.Error:
                    return
                default:
            }

            const dataPoint = {
                data,
                metadata,
            }

            const { current: cache } = cacheRef

            const existingMessage = cache.find((d) => (
                areMessagesSame(d.metadata.messageId, metadata.messageId)
            ))

            if (existingMessage) {
                // Duplicate message -> skip it
                return
            }

            cache.unshift(dataPoint)

            cache.length = Math.min(cache.length, LOCAL_DATA_LIST_LENGTH)

            setData([...cache])
        },
        isActive: !!(streamId),
    })

    const firstRunRef = useRef(true)

    useEffect(() => {
        if (firstRunRef.current) {
            return
        }
        firstRunRef.current = false

        setData(getEmptyData())
        cacheRef.current = getEmptyData()
    }, [streamId, partition])

    return data
}
