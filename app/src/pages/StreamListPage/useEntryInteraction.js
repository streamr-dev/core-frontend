import { useCallback, useEffect, useRef } from 'react'
import useStreamId from '$shared/hooks/useStreamId'

function normalize(fn) {
    return typeof fn === 'function' ? fn : () => {}
}

export default function useEntryInteraction(fn) {
    const streamId = useStreamId()

    const streamIdRef = useRef(streamId)

    useEffect(() => {
        streamIdRef.current = streamId
    }, [streamId])

    const fnRef = useRef(normalize(fn))

    useEffect(() => {
        fnRef.current = normalize(fn)
    }, [fn])

    return useCallback(() => {
        fnRef.current(streamIdRef.current)
    }, [])
}
