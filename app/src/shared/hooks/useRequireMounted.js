import { useCallback } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'
import UnmountedComponentError from '$shared/errors/UnmountedComponentError'

export default function useRequireMounted() {
    const isMounted = useIsMounted()

    return useCallback(() => {
        if (!isMounted()) {
            throw new UnmountedComponentError()
        }
    }, [isMounted])
}
