import { useCallback, useState, useRef, useEffect } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'
import { post, del } from '$shared/utils/api'
import routes from '$routes'

const useStreamStorageNodeToggle = (streamId, address, isEnabled, isChanging) => {
    const [changing, setChanging] = useState(isChanging)

    useEffect(() => {
        setChanging(isChanging)
    }, [isChanging])

    const [enabled, setEnabled] = useState(isEnabled)

    useEffect(() => {
        setEnabled(isEnabled)
    }, [isEnabled])

    const busyRef = useRef(!!isChanging)

    const isMounted = useIsMounted()

    const change = useCallback(async () => {
        if (busyRef.current) {
            return
        }
        busyRef.current = true

        setChanging(true)

        try {
            if (enabled) {
                await del({
                    url: routes.api.storageNodes.addresses.show({
                        streamId,
                        address,
                    }),
                })
            } else {
                await post({
                    url: routes.api.storageNodes.index({
                        id: streamId,
                    }),
                    data: {
                        address,
                    },
                })
            }

            if (isMounted()) {
                setEnabled(!enabled)
            }
        } catch (e) {
            console.error('Something unexpected happened', e)
        } finally {
            if (isMounted()) {
                setChanging(false)
            }
        }
    }, [isMounted, enabled, address, streamId])

    useEffect(() => {
        if (!changing) {
            busyRef.current = false
        }
    }, [changing])

    return [enabled, changing, change]
}

export default useStreamStorageNodeToggle
