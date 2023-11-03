import { useEffect, useState } from 'react'
import { NetworkNodeType } from 'streamr-client'
import { useSubscribe } from 'streamr-client-react'
import { z } from 'zod'

export function useInterceptHeartbeats(operatorId: string | undefined) {
    const streamId = `${operatorId}/operator/coordination`

    const [heartbeats, setHeartbeats] = useState<Record<string, Heartbeat | undefined>>(
        {},
    )

    useEffect(() => void setHeartbeats({}), [operatorId])

    useSubscribe(
        { id: streamId },
        {
            cacheKey: operatorId,
            disabled: !operatorId,
            onError: (e) => {
                console.warn('Failed to count live nodes', e)
            },
            onMessage(msg) {
                if (!isHeartbeatMessage(msg)) {
                    return
                }

                const { peerDescriptor } = msg.parsedContent

                setHeartbeats((prev) => ({
                    ...prev,
                    [peerDescriptor.id]: peerDescriptor,
                }))
            },
        },
    )

    return heartbeats
}

const HeartbeatMessage = z.object({
    parsedContent: z.object({
        msgType: z.literal('heartbeat'),
        peerDescriptor: z.object({
            id: z.string(),
            type: z.optional(z.nativeEnum(NetworkNodeType)),
            websocket: z
                .object({
                    host: z.string(),
                    port: z.number(),
                    tls: z.boolean(),
                })
                .optional(),
            openInternet: z.boolean().optional(),
            region: z.number().optional(),
        }),
    }),
})

type HeartbeatMessage = z.infer<typeof HeartbeatMessage>

function isHeartbeatMessage(arg: unknown): arg is HeartbeatMessage {
    return HeartbeatMessage.safeParse(arg).success
}

export type Heartbeat = HeartbeatMessage['parsedContent']['peerDescriptor']
