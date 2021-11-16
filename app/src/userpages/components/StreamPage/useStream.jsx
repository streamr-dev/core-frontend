import { useReducer, useCallback, useMemo } from 'react'
import { useClient } from 'streamr-client-react'

import { canHandleLoadError, handleLoadError } from '$auth/utils/loginInterceptor'
import useFailure from '$shared/hooks/useFailure'
import useIsMounted from '$shared/hooks/useIsMounted'
import { NotificationIcon } from '$shared/utils/constants'
import Notification from '$shared/utils/Notification'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'

function useStream() {
    const client = useClient()
    const fail = useFailure()
    const isMounted = useIsMounted()

    const [{ stream, permissions, fetching }, setStream] = useReducer((state, { stream, permissions }) => ({
        stream,
        permissions,
        fetching: false,
    }), {
        fetching: true,
    })

    const fetch = useCallback(async ({ streamId, isPublic = false }) => {
        try {
            try {
                const stream = await client.getStream(streamId)
                const permissions = await stream.getMyPermissions()

                if (isMounted()) {
                    setStream({
                        stream,
                        permissions,
                    })
                }
            } catch (error) {
                if (canHandleLoadError(error)) {
                    await handleLoadError({
                        error,
                        // We want to show a 404 page when on public stream url while the stream has no public permissions
                        ignoreUnauthorized: isPublic,
                    })
                } else {
                    throw error
                }
            }
        } catch (e) {
            if (!(e instanceof ResourceNotFoundError)) {
                console.warn(e)

                if (isMounted()) {
                    Notification.push({
                        title: 'Stream not found',
                        icon: NotificationIcon.ERROR,
                    })
                }
            }
            fail(e)
        }
    }, [client, isMounted, setStream, fail])

    return useMemo(() => ({
        stream,
        permissions,
        fetching,
        fetch,
    }), [
        stream,
        permissions,
        fetching,
        fetch,
    ])
}

export default useStream
