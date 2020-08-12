import React, { useState, useCallback, useRef, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { Translate } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import { Provider as ClientProvider, Context as ClientContext } from '$shared/contexts/StreamrClient'
import useModal from '$shared/hooks/useModal'
import Subscription from '$shared/components/Subscription'
import { Provider as SubscriptionStatusProvider } from '$shared/contexts/SubscriptionStatus'
import useIsMounted from '$shared/hooks/useIsMounted'
import { useThrottled } from '$shared/hooks/wrapCallback'

import PreviewTable from './PreviewTable'
import PreviewModal from './PreviewModal'

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

const PREVIEW_TABLE_LENGTH = 5
const LOCAL_DATA_LIST_LENGTH = 20

const initialState = Array(PREVIEW_TABLE_LENGTH).fill(undefined)

const UnstyledPreviewView = ({ stream, currentUser, ...props }) => {
    const [isRunning, setIsRunning] = useState(true)
    const { api: showPreviewDialog, isOpen: isPreviewDialogOpen } = useModal('userpages.streamPreview')

    const [hasData, setHasData] = useState(false)
    const dataRef = useRef([])
    const [visibleData, setVisibleData] = useState(initialState)
    const [dataReceived, setDataReceived] = useState(false)
    const [dataError, setDataError] = useState(false)
    const { hasLoaded, client } = useContext(ClientContext)
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
        <ClientProvider>
            <SubscriptionStatusProvider>
                <Subscription
                    uiChannel={{
                        id: stream.id,
                    }}
                    resendLast={LOCAL_DATA_LIST_LENGTH}
                    onSubscribed={onSub}
                    isActive={isRunning}
                    onMessage={onData}
                    onErrorMessage={onError}
                />
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
                    <PreviewModal
                        streamId={stream.id}
                        stream={stream}
                        streamData={visibleData}
                        onClose={() => showPreviewDialog.close()}
                    />
                )}
            </SubscriptionStatusProvider>
        </ClientProvider>
    )
}

const PreviewView = styled(UnstyledPreviewView)`
    background-color: #fdfdfd;
    display: grid;
    grid-template-rows: 1fr 72px;
    position: relative;
`

export default PreviewView
