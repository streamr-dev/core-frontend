import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    closeStream,
    getStream,
    getStreamStatus,
    initEditStream,
    openStream,
    updateEditStream,
} from '$userpages/modules/userPageStreams/actions'
import { canHandleLoadError, handleLoadError } from '$auth/utils/loginInterceptor'
import { NotificationIcon } from '$shared/utils/constants'
import {
    selectFetching,
    selectUpdating,
    selectOpenStream,
    selectEditedStream,
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

const StreamPage = (props) => {
    const { id: idProp } = props.match.params || {}

    const permissions = useStreamPermissions(idProp)

    const fetching = useSelector(selectFetching)

    const updating = useSelector(selectUpdating)

    const dispatch = useDispatch()

    const fail = useFailure()

    const readOnly = !(permissions || []).includes('stream_edit')

    const canShare = (permissions || []).includes('stream_share')

    const stream = useSelector(selectOpenStream)

    const editedStream = useSelector(selectEditedStream)

    const currentUser = useSelector(selectUserData)

    const isMounted = useIsMounted()

    const { id } = stream || {}

    useEffect(() => {
        const fetch = async () => {
            try {
                try {
                    await dispatch(getStream(idProp))
                    if (isMounted()) {
                        dispatch(openStream(idProp))
                    }
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
    }, [fail, dispatch, idProp, isMounted, permissions])

    useEffect(() => {
        const initEditing = async () => {
            // Get stream status before copying state to edit stream object.
            try {
                // The status query might fail due to cassandra problems. Ignore error to prevent
                // the stream page from getting stuck while loading
                await dispatch(getStreamStatus(id))
            } catch (e) {
                console.warn(e)
            }
            if (isMounted()) {
                dispatch(initEditStream())
            }
        }

        if (!readOnly && id) {
            initEditing()
        }
    }, [id, readOnly, dispatch, isMounted])

    useEffect(() => () => {
        dispatch(updateEditStream(null))
        dispatch(closeStream())
    }, [dispatch])

    if (!permissions || (fetching && !updating) || !stream || (!readOnly && !editedStream)) {
        return (
            <Layout loading />
        )
    }

    return readOnly ? (
        <View
            stream={stream}
            currentUser={currentUser}
        />
    ) : (
        <Edit
            stream={editedStream}
            canShare={canShare}
            disabled={updating}
        />
    )
}

export default StreamPage
