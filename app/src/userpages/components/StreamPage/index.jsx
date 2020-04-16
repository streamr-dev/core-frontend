// @flow

import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { type Match } from 'react-router-dom'
import { getStream, getMyStreamPermissions, openStream } from '$userpages/modules/userPageStreams/actions'
import { handleLoadError } from '$auth/utils/loginInterceptor'
import { NotificationIcon } from '$shared/utils/constants'
import { selectPermissions, selectFetching, selectOpenStream } from '$userpages/modules/userPageStreams/selectors'
import Notification from '$shared/utils/Notification'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import useFailure from '$shared/hooks/useFailure'
// import Edit from './Edit'
import View from './View'
import Layout from '$shared/components/Layout/Core'

type Props = {
    match: Match,
}

const StreamPage = (props: Props) => {
    const { id } = props.match.params || {}

    const permissions = useSelector(selectPermissions)

    const fetching = useSelector(selectFetching)

    const dispatch = useDispatch()

    const fail = useFailure()

    const readOnly = !permissions || !permissions.some((p) => p === 'write')

    const stream = useSelector(selectOpenStream)

    useEffect(() => {
        const fetch = async () => {
            try {
                try {
                    await Promise.all([
                        (async () => {
                            await dispatch(getStream(id))
                            dispatch(openStream(id))
                        })(),
                        dispatch(getMyStreamPermissions(id)),
                    ])
                } catch (e) {
                    handleLoadError(e)
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

        fetch()
    }, [fail, dispatch, id])

    if (fetching || !stream) {
        return (
            <Layout loading />
        )
    }

    return readOnly ? (
        <View stream={stream} />
    ) : (
        'editable'
    )
}

export default StreamPage
