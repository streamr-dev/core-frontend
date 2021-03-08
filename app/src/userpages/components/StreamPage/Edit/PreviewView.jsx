import React, { useState, useCallback, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useClient, useSubscription } from 'streamr-client-react'
import Button from '$shared/components/Button'
import useModal from '$shared/hooks/useModal'
import useIsMounted from '$shared/hooks/useIsMounted'
import { useThrottled } from '$shared/hooks/wrapCallback'
import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
import StreamPreview from '$shared/components/StreamPreview'
import useIsSessionTokenReady from '$shared/hooks/useIsSessionTokenReady'
import { Message } from '$shared/utils/SubscriptionEvents'
import PreviewTable from './PreviewTable'
import docsLinks from '$shared/../docsLinks'

const Wrapper = styled.div`
    border: 1px solid #ebebeb;
    border-radius: 4px;
`

const Controls = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
    padding: 1rem;

    > * + * {
        margin-left: 1rem;
    }
`

const ErrorNotice = styled.div`
    flex: 1;
    font-size: 12px;
    color: #808080;

    p {
        margin: 0;
        line-height: 1.5rem;
    }
`

const Description = styled.p`
    margin-bottom: 3.125rem;
    max-width: 660px;
`

const StreamPreviewDialog = ({ onClose, ...previewProps }) => (
    <ModalPortal>
        <ModalDialog onClose={onClose} fullpage noScroll>
            <StreamPreview {...previewProps} onClose={onClose} />
        </ModalDialog>
    </ModalPortal>
)

const PREVIEW_TABLE_LENGTH = 5
const LOCAL_DATA_LIST_LENGTH = 20

const initialState = Array(PREVIEW_TABLE_LENGTH).fill(undefined)

const UnstyledPreviewView = ({ stream, subscribe = true, showDescription = true, ...props }) => {
    const [isRunning, setIsRunning] = useState(true)
    const { api: showPreviewDialog, isOpen: isPreviewDialogOpen } = useModal('userpages.streamPreview')

    const [hasData, setHasData] = useState(!subscribe)
    const dataRef = useRef([])
    const [visibleData, setVisibleData] = useState(initialState)
    const [dataReceived, setDataReceived] = useState(false)
    const [dataError, setDataError] = useState(false)
    const hasLoaded = useIsSessionTokenReady()
    const client = useClient()
    window.streamrClient = client
    const [activePartition, setActivePartition] = useState(0)
    const isMounted = useIsMounted()
    const updateDataToState = useThrottled(useCallback((data) => {
        setDataReceived(true)
        setVisibleData([...data])
    }, []), 100)

    useEffect(() => {
        if (dataReceived) {
            setHasData(true)
        }
    }, [dataReceived])

    const onError = useCallback(() => {
        if (isMounted()) {
            setDataError(true)
        }
    }, [isMounted])

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
                onError()
                return
            }
            default: // continue
        }

        const dataPoint = {
            data,
            metadata,
        }

        dataRef.current.unshift(dataPoint)
        dataRef.current.length = Math.min(dataRef.current.length, LOCAL_DATA_LIST_LENGTH)
        updateDataToState(dataRef.current)
    }, [dataRef, updateDataToState, isMounted, onError])

    const onSub = useCallback(() => {
        if (isMounted()) {
            // Clear data when subscribed to make sure
            // we don't get duplicate messages with resend
            setVisibleData([...initialState])
            dataRef.current = [...initialState]
            setDataReceived(false)
        }
    }, [isMounted])

    useEffect(() => {
        setVisibleData([...initialState])
    }, [activePartition])

    const onToggleRun = useCallback(() => {
        setIsRunning((wasRunning) => !wasRunning)
    }, [setIsRunning])

    const showPreview = useCallback(async (streamId, stream) => {
        await showPreviewDialog.open({
            streamId,
            stream,
        })
    }, [showPreviewDialog])

    useSubscription({
        stream: stream && stream.id,
        partition: activePartition,
        resend: {
            last: LOCAL_DATA_LIST_LENGTH,
        },
    }, {
        onMessage: onData,
        onSubscribed: onSub,
        isActive: !!(stream && stream.id && subscribe && isRunning),
    })

    if (!stream || !stream.id) {
        return null
    }

    return (
        <React.Fragment>
            {!!showDescription && (
                <Description>
                    Live data in this stream is displayed below. For a more detailed view, you can open the Inspector.
                    {' '}
                    If you need help pushing data to your stream, see the
                    {' '}
                    <Link to={docsLinks.gettingStarted}>docs</Link>.
                </Description>
            )}
            <Wrapper {...props}>
                <PreviewTable
                    streamData={visibleData.slice(0, PREVIEW_TABLE_LENGTH)}
                />
                <Controls>
                    <ErrorNotice>
                        {hasLoaded && !client && (
                            <p>
                                Error: Unable to process the stream data.
                            </p>
                        )}
                        {dataError && (
                            <p>
                                Error: Some messages in the stream have invalid content and are not shown.
                            </p>
                        )}
                    </ErrorNotice>
                    <Button
                        kind="secondary"
                        onClick={onToggleRun}
                        disabled={!hasData}
                    >
                        {!isRunning ? 'Start' : 'Stop'}
                    </Button>
                    <Button
                        kind="secondary"
                        onClick={() => showPreview(stream.id, stream)}
                        disabled={!hasData}
                    >
                        Inspect data
                    </Button>
                </Controls>
            </Wrapper>
            {!!isPreviewDialogOpen && (
                <StreamPreviewDialog
                    streamId={stream.id}
                    stream={stream}
                    streamData={visibleData}
                    activePartition={activePartition}
                    onPartitionChange={setActivePartition}
                    onClose={() => showPreviewDialog.close()}
                />
            )}
        </React.Fragment>
    )
}

const PreviewView = styled(UnstyledPreviewView)`
    background-color: #fdfdfd;
    display: grid;
    grid-template-rows: 1fr 72px;
    position: relative;
`

export default PreviewView
