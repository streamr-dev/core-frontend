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

// eslint-disable-next-line max-len
export default function useStreamData(streamId, { partition = 0, activeFn: activeFnProp, onError: onErrorProp, tail = Number.POSITIVE_INFINITY } = {}) {
    const isMounted = useIsMounted()

    const cacheRef = useRef(getEmptyData())

    const [data, setData] = useState(getEmptyData())

    const activeFn = typeof activeFnProp === 'function' ? activeFnProp : () => streamId

    const onErrorRef = useRef(onErrorProp)

    useEffect(() => {
        onErrorRef.current = onErrorProp
    }, [onErrorProp])

    useSubscription({
        stream: streamId,
        partition,
        gapFill: false,
    }, {
        onMessage(message, metadata) {
            if (!isMounted()) {
                return
            }

            switch (message.type) {
                case Message.Done:
                case Message.Notification:
                case Message.Warning:
                    return
                case Message.Error:
                    if (typeof onErrorRef.current === 'function') {
                        onErrorRef.current()
                    }
                    return
                default:
            }

            const dataPoint = {
                data: message,
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

            cache.length = Math.min(cache.length, tail)

            setData([...cache])
        },
        isActive: !!activeFn(),
    })

    const firstRunRef = useRef(true)

    useEffect(() => {
        if (firstRunRef.current) {
            firstRunRef.current = false
            return
        }

        setData(getEmptyData())
        cacheRef.current = getEmptyData()
    }, [streamId, partition])

    return data
}
