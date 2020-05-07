// @flow

import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getMyStreamPermissions } from '$userpages/modules/userPageStreams/actions'
import { selectPermissions, selectFetching } from '$userpages/modules/userPageStreams/selectors'
import UnauthorizedError from '$shared/errors/UnauthorizedError'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import { handleLoadError } from '$auth/utils/loginInterceptor'
import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'
import useFailure from '$shared/hooks/useFailure'

import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useIsMounted from '$shared/hooks/useIsMounted'

export default (streamId: string) => {
    const isMounted = useIsMounted()

    const permissions = useSelector(selectPermissions)

    const dispatch = useDispatch()

    const fetching = useSelector(selectFetching)

    const fail = useFailure()

    const idRef = useRef(streamId)

    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (ready) {
            return
        }

        const fetch = async (id) => {
            if (!id) {
                return
            }
            try {
                try {
                    await dispatch(getMyResourceKeys())
                } catch (e) { /**/ }
                if (!isMounted()) {
                    return
                }
                try {
                    await dispatch(getMyStreamPermissions(id))
                } catch (e) {
                    await handleLoadError(e)
                }
                if (isMounted()) {
                    setReady(true)
                }
            } catch (e) {
                if (e instanceof ResourceNotFoundError) {
                    fail(e)
                    return
                }
                Notification.push({
                    title: e.message,
                    icon: NotificationIcon.ERROR,
                })
                throw e
            }
        }

        fetch(idRef.current)
    }, [ready, dispatch, fail, isMounted])

    useEffect(() => {
        idRef.current = streamId
        setReady(false)
    }, [streamId])

    const loaded = !!ready && !fetching

    const canRead = (permissions || []).includes('read')

    if (loaded && !canRead) {
        throw new UnauthorizedError()
    }

    return loaded
}
