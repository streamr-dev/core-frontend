import { useEffect, useMemo, useState } from 'react'
import { useSubscribe } from 'streamr-client-react'

export default function useOperatorLiveNodes(operatorId: string) {
    const streamId = `${operatorId}/operator/coordination`
    const [liveNodes, setLiveNodes] = useState<Record<string, boolean>>({})
    const [isLoading, setIsLoading] = useState(true)

    useSubscribe(
        { id: streamId },
        {
            onError: (e) => {
                console.warn(e)
            },
            onMessage(msg) {
                const data = msg.parsedContent as any
                if (data?.msgType === 'heartbeat' && data?.peerDescriptor?.id != null) {
                    const address = (data.peerDescriptor.id as string).toLowerCase()
                    if (!liveNodes[address]) {
                        setLiveNodes((prev) => ({...prev, [address]: true}))
                    }
                }
            },
        },
    )

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 15000)
    }, [])

    return {
        count: Object.keys(liveNodes).length,
        isLoading,
    }
}
