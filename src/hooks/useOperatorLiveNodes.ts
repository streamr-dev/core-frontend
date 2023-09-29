import { useEffect, useState } from 'react'
import { useSubscribe } from 'streamr-client-react'
import { z } from 'zod'

const HeartbeatMessage = z.object({
    parsedContent: z.object({
        msgType: z.literal('heartbeat'),
        peerDescriptor: z.object({
            id: z.string(),
        }),
    }),
})

type HeartbeatMessage = z.infer<typeof HeartbeatMessage>

function isHeartbeatMessage(arg: unknown): arg is HeartbeatMessage {
    return HeartbeatMessage.safeParse(arg).success
}

export default function useOperatorLiveNodes(operatorId: string) {
    const streamId = `${operatorId}/operator/coordination`

    const [liveNodes, setLiveNodes] = useState<Record<string, true>>({})

    const [isLoading, setIsLoading] = useState(false)

    useSubscribe(
        { id: streamId },
        {
            onError: (e) => {
                console.warn('Failed to count live nodes', e)
            },
            onMessage(msg) {
                if (!isHeartbeatMessage(msg)) {
                    return
                }

                const address = msg.parsedContent.peerDescriptor.id.toLowerCase()

                setLiveNodes((prev) =>
                    prev[address] ? prev : { ...prev, [address]: true },
                )
            },
        },
    )

    useEffect(() => {
        let mounted = true

        setIsLoading(true)

        setTimeout(() => {
            if (mounted) {
                setIsLoading(false)
            }
        }, 15000)

        return () => {
            mounted = false
        }
    }, [])

    return {
        count: Object.keys(liveNodes).length,
        isLoading,
    }
}
