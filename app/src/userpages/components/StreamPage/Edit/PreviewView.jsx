import React, { useState, useCallback, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Translate } from 'react-redux-i18n'
import { useClient } from 'streamr-client-react'
import Button from '$shared/components/Button'
import useModal from '$shared/hooks/useModal'
import Subscription from '$shared/components/Subscription'
import { Provider as SubscriptionStatusProvider } from '$shared/contexts/SubscriptionStatus'
import useIsMounted from '$shared/hooks/useIsMounted'
import { useThrottled } from '$shared/hooks/wrapCallback'
import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
import StreamPreview from '$mp/components/StreamPreview'
import useIsSessionTokenReady from '$shared/hooks/useIsSessionTokenReady'
import docsLinks from '$shared/../docsLinks'

import PreviewTable from './PreviewTable'

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

const FullPage = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(239, 239, 239, 0.98);
    z-index: 1;
    overflow-y: scroll;
`

const Description = styled(Translate)`
    margin-bottom: 3.125rem;
    max-width: 660px;
`

const StreamPreviewDialog = ({ onClose, ...previewProps }) => (
    <ModalPortal>
        <ModalDialog onClose={onClose}>
            <FullPage>
                <StreamPreview {...previewProps} onClose={onClose} />
            </FullPage>
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

    const onData = useCallback((data, metadata) => {
        if (!isMounted()) { return }

        const dataPoint = {
            data,
            metadata,
        }

        dataRef.current.unshift(dataPoint)
        dataRef.current.length = Math.min(dataRef.current.length, LOCAL_DATA_LIST_LENGTH)
        updateDataToState(dataRef.current)
    }, [dataRef, updateDataToState, isMounted])

    const onSub = useCallback(() => {
        if (isMounted()) {
            // Clear data when subscribed to make sure
            // we don't get duplicate messages with resend
            setVisibleData([...initialState])
            dataRef.current = [...initialState]
            setDataReceived(false)
        }
    }, [isMounted])

    const onError = useCallback(() => {
        if (isMounted()) {
            setDataError(true)
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

    if (!stream || !stream.id) {
        return null
    }

    return (
        <SubscriptionStatusProvider>
            {!!subscribe && (
                <Subscription
                    uiChannel={{
                        id: stream.id,
                        partition: activePartition,
                    }}
                    resendLast={LOCAL_DATA_LIST_LENGTH}
                    onSubscribed={onSub}
                    isActive={isRunning}
                    onMessage={onData}
                    onErrorMessage={onError}
                />
            )}
            {!!showDescription && (
                <Description
                    value="userpages.streams.edit.preview.description"
                    tag="p"
                    dangerousHTML
                    docsLink={docsLinks.gettingStarted}
                />
            )}
            <Wrapper {...props}>
                <PreviewTable
                    streamData={visibleData.slice(0, PREVIEW_TABLE_LENGTH)}
                />
                <Controls>
                    <ErrorNotice>
                        {hasLoaded && !client && (
                            <Translate value="streamLivePreview.subscriptionErrorNotice" tag="p" />
                        )}
                        {dataError && (
                            <Translate value="streamLivePreview.dataErrorNotice" tag="p" />
                        )}
                    </ErrorNotice>
                    <Button
                        kind="secondary"
                        onClick={onToggleRun}
                        disabled={!hasData}
                    >
                        {!isRunning ?
                            <Translate value="userpages.streams.edit.preview.start" /> :
                            <Translate value="userpages.streams.edit.preview.stop" />
                        }
                    </Button>
                    <Button
                        kind="secondary"
                        onClick={() => showPreview(stream.id, stream)}
                        disabled={!hasData}
                    >
                        <Translate value="userpages.streams.edit.preview.inspect" />
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
        </SubscriptionStatusProvider>
    )
}

const PreviewView = styled(UnstyledPreviewView)`
    background-color: #fdfdfd;
    display: grid;
    grid-template-rows: 1fr 72px;
    position: relative;
`

export default PreviewView
