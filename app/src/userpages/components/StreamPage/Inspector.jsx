import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useSubscription } from 'streamr-client-react'

import useIsMounted from '$shared/hooks/useIsMounted'
import ModalDialog from '$shared/components/ModalDialog'
import { useThrottled } from '$shared/hooks/wrapCallback'
import StreamPreview from '$shared/components/StreamPreview'
import { Message } from '$shared/utils/SubscriptionEvents'
import routes from '$routes'

import StreamController, { useController } from '../StreamController'

const LOCAL_DATA_LIST_LENGTH = 20
const initialState = []

const areMessagesSame = (a, b) => {
    const aRef = a.toMessageRef()
    const bRef = b.toMessageRef()
    return aRef.compareTo(bRef) === 0
}

const UnstyledInspectorView = ({ streamId }) => {
    const history = useHistory()
    const { stream } = useController()

    const dataRef = useRef([])
    const [visibleData, setVisibleData] = useState(initialState)
    const [activePartition, setActivePartition] = useState(0)
    const isMounted = useIsMounted()

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
            loading={!stream}
        />
    )
}

const InspectorView = styled(UnstyledInspectorView)`
    background-color: #fdfdfd;
    display: grid;
    grid-template-rows: 1fr 72px;
    position: relative;
`

const WrappedInspectorView = (props) => {
    const { id: idProp } = useParams()
    const decodedIdProp = useMemo(() => decodeURIComponent(idProp), [idProp])

    return (
        <StreamController key={idProp} autoLoadStreamId={decodedIdProp}>
            {/* We are not actually showing a modal dialog but StreamPreview needs css from ModalDialog to function */}
            <ModalDialog onClose={() => {}} fullpage noScroll>
                <InspectorView {...props} streamId={decodedIdProp} />
            </ModalDialog>
        </StreamController>
    )
}

export default WrappedInspectorView
