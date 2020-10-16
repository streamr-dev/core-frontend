import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    closeStream,
    getStream,
    initEditStream,
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
            if (isMounted()) {
                dispatch(initEditStream())
            }
        }

        if (!readOnly && id) {
            initEditing()
        }
    }, [id, readOnly, dispatch, isMounted])

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
                />
            )}
        </ClientProvider>
    )
}

export default StreamPage
