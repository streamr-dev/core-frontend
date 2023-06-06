import { useState, useRef, useEffect } from 'react'
import { useSubscribe } from 'streamr-client-react'
import { MessageID } from 'streamr-client'
import useIsMounted from '$shared/hooks/useIsMounted'

type Params = {
    partition?: number
    activeFn?: () => boolean
    onError?: () => void
    tail?: number
}

function getEmptyData() {
    return []
}

function areMessagesSame(a: MessageID, b: MessageID) {
    return a.toMessageRef().compareTo(b.toMessageRef()) === 0
}

export default function useStreamData(
    streamId: string,
    {
        partition = 0,
        activeFn: activeFnProp,
        onError: onErrorProp,
        tail = Number.POSITIVE_INFINITY,
    }: Params = {},
): Array<any> {
    const isMounted = useIsMounted()
    const cacheRef = useRef(getEmptyData())
    const [data, setData] = useState(getEmptyData())
    const activeFn = typeof activeFnProp === 'function' ? activeFnProp : () => streamId
    const onErrorRef = useRef(onErrorProp)
    useEffect(() => {
        onErrorRef.current = onErrorProp
    }, [onErrorProp])
    useSubscribe(
        { id: streamId, partition: partition },
        {
            disabled: !activeFn(),
            onError: (e) => {
                console.warn(e)
                if (typeof onErrorRef.current === 'function') {
                    onErrorRef.current()
                }
            },
            onMessage(msg) {
                if (!isMounted()) {
                    return
                }

                const dataPoint = {
                    data: msg.parsedContent,
                    metadata: {
                        messageId: msg.getMessageID(),
                        timestamp: msg.getTimestamp(),
                    },
                }
                const { current: cache } = cacheRef
                const existingMessage = cache.find((d) =>
                    areMessagesSame(d.metadata.messageId, dataPoint.metadata.messageId),
                )

                if (existingMessage) {
                    // Duplicate message -> skip it
                    return
                }

                cache.unshift(dataPoint)
                cache.length = Math.min(cache.length, tail)
                setData([...cache])
            },
        },
    )
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
