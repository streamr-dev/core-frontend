import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    closeStream,
    getStream,
    openStream,
} from '$userpages/modules/userPageStreams/actions'
import { canHandleLoadError, handleLoadError } from '$auth/utils/loginInterceptor'
import { NotificationIcon } from '$shared/utils/constants'
import {
    selectFetching,
    selectUpdating,
    selectOpenStream,
} from '$userpages/modules/userPageStreams/selectors'
import { selectUserData } from '$shared/modules/user/selectors'
import Notification from '$shared/utils/Notification'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import useFailure from '$shared/hooks/useFailure'
import Edit from './Edit'
import View from './View'
import Layout from '$shared/components/Layout/Core'
import useIsMounted from '$shared/hooks/useIsMounted'
import useStreamPermissions from '$userpages/hooks/useStreamPermissions'
import ClientProvider from '$shared/components/StreamrClientProvider'
import useNewStreamMode from './useNewStreamMode'

const StreamPage = (props) => {
    const { id: idProp } = props.match.params || {}
    const decodedIdProp = useMemo(() => decodeURIComponent(idProp), [idProp])
    const permissions = useStreamPermissions(decodedIdProp)

    const fetching = useSelector(selectFetching)

    const updating = useSelector(selectUpdating)

    const dispatch = useDispatch()

    const fail = useFailure()

    const readOnly = !(permissions || []).includes('stream_edit')

    const canShare = (permissions || []).includes('stream_share')

    const stream = useSelector(selectOpenStream)

    const currentUser = useSelector(selectUserData)

    const isMounted = useIsMounted()

    const { isNewStream } = useNewStreamMode()

    useEffect(() => {
        const fetch = async () => {
            try {
                try {
                    await dispatch(getStream(decodedIdProp))

                    if (!isMounted()) { return }

                    // set the current stream as the editable entity
                    dispatch(openStream(decodedIdProp))
                } catch (error) {
                    if (canHandleLoadError(error)) {
                        await handleLoadError({
                            error,
                        })
                    } else {
                        throw error
                    }
                }
            } catch (e) {
                if (!(e instanceof ResourceNotFoundError)) {
                    Notification.push({
                        title: e.message,
                        icon: NotificationIcon.ERROR,
                    })
                }
                fail(e)
            }
        }

        if (permissions) {
            fetch()
        }
    }, [fail, dispatch, decodedIdProp, isMounted, permissions])

    useEffect(() => () => {
        dispatch(closeStream())
    }, [dispatch])

    if (!permissions || (fetching && !updating) || !stream) {
        return (
            <Layout loading />
        )
    }

    return (
        <ClientProvider>
            {readOnly ? (
                <View
                    stream={stream}
                    currentUser={currentUser}
                />
            ) : (
                <Edit
                    stream={stream}
                    canShare={canShare}
                    disabled={updating}
                    isNewStream={isNewStream}
                />
            )}
        </ClientProvider>
    )
}

export default StreamPage
