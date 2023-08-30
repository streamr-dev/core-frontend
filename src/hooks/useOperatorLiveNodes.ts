import { useState } from 'react'
import { useSubscribe } from 'streamr-client-react'

export default function useOperatorLiveNodes(operatorId?: string) {
    const streamId = `${operatorId}/operator/coordination/`
    const [liveNodes, setLiveNodes] = useState<string[]>([])

    useSubscribe(
        { id: streamId },
        {
            onError: (e) => {
                console.warn(e)
            },
            onMessage(msg) {
                const data = msg.parsedContent as any
                if (data.type === 'heartbeat' && data.nodeId != null) {
                    const address = (data.nodeId as string).toLowerCase()
                    if (!liveNodes.includes(address)) {
                        setLiveNodes((prev) => [...prev, address])
                    }
                }
            },
        },
    )

    return {
        count: liveNodes.length,
    }
}
