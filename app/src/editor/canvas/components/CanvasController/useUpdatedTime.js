import { useState, useMemo, useCallback, useEffect } from 'react'

export default function useUpdatedTime(updated) {
    const updatedTime = (new Date(updated)).getTime()
    const [lastUpdated, setUpdatedState] = useState(updatedTime)

    const setUpdated = useCallback((updated) => {
        const nextUpdatedUpdated = (new Date(updated)).getTime()
        setUpdatedState((lastUpdated) => {
            const updated = Math.max(lastUpdated || nextUpdatedUpdated, nextUpdatedUpdated)
            if (lastUpdated === updated) { return lastUpdated }
            return updated
        })
    }, [setUpdatedState])

    useEffect(() => {
        setUpdated(updatedTime)
    }, [setUpdated, updatedTime])

    return useMemo(() => [
        lastUpdated,
        setUpdated,
    ], [lastUpdated, setUpdated])
}
