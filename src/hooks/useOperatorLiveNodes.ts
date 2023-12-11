import { useEffect, useState } from 'react'
import { Heartbeat } from './useInterceptHeartbeats'

export default function useOperatorLiveNodes(
    heartbeats: Record<string, Heartbeat | undefined>,
) {
    const count = Object.keys(heartbeats).length

    const [isLoading, setIsLoading] = useState(false)

    const detectedAny = count > 0

    useEffect(() => {
        if (detectedAny) {
            return void setIsLoading(false)
        }

        let mounted = true

        setIsLoading(true)

        setTimeout(() => {
            if (mounted) {
                setIsLoading(false)
            }
        }, 30000)

        return () => {
            mounted = false
        }
    }, [detectedAny])

    return {
        count,
        isLoading,
    }
}
