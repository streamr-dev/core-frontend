// @flow

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useSubscription } from 'streamr-client-react'
import { useSelector, useDispatch } from 'react-redux'

import {
    closeStream,
    getStream,
    openStream,
} from '$userpages/modules/userPageStreams/actions'
import { selectOpenStream } from '$userpages/modules/userPageStreams/selectors'
import { canHandleLoadError, handleLoadError } from '$auth/utils/loginInterceptor'
import Notification from '$shared/utils/Notification'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import { NotificationIcon } from '$shared/utils/constants'
import useStreamPermissions from '$userpages/hooks/useStreamPermissions'
import useIsMounted from '$shared/hooks/useIsMounted'
import useFailure from '$shared/hooks/useFailure'
import ModalDialog from '$shared/components/ModalDialog'
import { useThrottled } from '$shared/hooks/wrapCallback'
import ClientProvider from '$shared/components/StreamrClientProvider'
import StreamPreview from '$shared/components/StreamPreview'
import { Message } from '$shared/utils/SubscriptionEvents'
import routes from '$routes'

const LOCAL_DATA_LIST_LENGTH = 20
const initialState = []

const areMessagesSame = (a, b) => {
    const aRef = a.toMessageRef()
    const bRef = b.toMessageRef()
    return aRef.compareTo(bRef) === 0
}

const UnstyledInspectorView = (props) => {
    const dispatch = useDispatch()
    const fail = useFailure()
    const { history } = props
    const { id: idProp } = props.match.params || {}
    const decodedIdProp = useMemo(() => decodeURIComponent(idProp), [idProp])
    const permissions = useStreamPermissions(decodedIdProp)
    const stream = useSelector(selectOpenStream)

    const dataRef = useRef([])
    const [visibleData, setVisibleData] = useState(initialState)
    const [activePartition, setActivePartition] = useState(0)
    const isMounted = useIsMounted()
    const streamId = stream && stream.id

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
                            ignoreUnauthorized: true,
                        })
                    } else {
                        throw error
                    }
                }
            } catch (e) {
                if (!(e instanceof ResourceNotFoundError)) {
                    console.warn(e)

                    Notification.push({
                        title: 'Stream not found',
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

    const updateDataToState = useThrottled(useCallback((data) => {
        setVisibleData([...data])
    }, []), 100)

    const onData = useCallback((data, metadata) => {
        if (!isMounted()) { return }
        switch (data.type) {
            case Message.Done:
            case Message.Notification:
            case Message.Warning: {
                // ignore
                return
            }
            case Message.Error: {
                return
            }
            default: // continue
        }

        const dataPoint = {
            data,
            metadata,
        }

        if (dataRef.current.find((d) => d != null && areMessagesSame(d.metadata.messageId, metadata.messageId)) != null) {
            // Duplicate message -> skip it
            return
        }

        dataRef.current.unshift(dataPoint)
        dataRef.current.length = Math.min(dataRef.current.length, LOCAL_DATA_LIST_LENGTH)
        updateDataToState(dataRef.current)
    }, [dataRef, updateDataToState, isMounted])

    const reset = useCallback(() => {
        setVisibleData([...initialState])
        dataRef.current = [...initialState]
    }, [])

    useEffect(() => {
        reset()
    }, [activePartition, streamId, reset])

    useSubscription({
        stream: streamId,
        partition: activePartition,
        resend: {
            last: LOCAL_DATA_LIST_LENGTH,
        },
    }, {
        onMessage: onData,
        isActive: !!(streamId),
    })

    if (!streamId) {
        return null
    }

    return (
        <StreamPreview
            streamId={streamId}
            stream={stream}
            streamData={visibleData}
            activePartition={activePartition}
            onPartitionChange={setActivePartition}
            onClose={() => history.replace(routes.streams.public.show({
                id: streamId,
            }))}
        />
    )
}

const InspectorView = styled(UnstyledInspectorView)`
    background-color: #fdfdfd;
    display: grid;
    grid-template-rows: 1fr 72px;
    position: relative;
`

const WrappedInspectorView = (props: any) => (
    <ClientProvider>
        {/* We are not actually showing a modal dialog but StreamPreview needs css from ModalDialog to function */}
        <ModalDialog onClose={() => {}} fullpage noScroll>
            <InspectorView {...props} />
        </ModalDialog>
    </ClientProvider>
)

export default WrappedInspectorView
