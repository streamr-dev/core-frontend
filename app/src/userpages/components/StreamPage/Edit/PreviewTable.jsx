// @flow

import React, { useState, useCallback, useRef, useContext, useEffect } from 'react'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import { Translate } from 'react-redux-i18n'
import styled, { css } from 'styled-components'

import Subscription from '$shared/components/Subscription'
import { Provider as SubscriptionStatusProvider } from '$shared/contexts/SubscriptionStatus'
import { Context as ClientContext } from '$shared/contexts/StreamrClient'
import { formatDateTime } from '$mp/utils/time'
import type { StreamId } from '$shared/flowtype/stream-types'
import useIsMounted from '$shared/hooks/useIsMounted'
import { useThrottled } from '$shared/hooks/wrapCallback'
import { MD, LG } from '$shared/utils/styled'

const tz = moment.tz.guess()

const Row = styled.div`
    border-bottom: 1px solid #EBEBEB;
    display: grid;
    grid-template-columns: minmax(190px, auto) 1fr;

    ${({ highlight }) => !!highlight && css`
        cursor: pointer;

        &:hover {
            background-color: #F8F8F8;
        }
    `} 

    @media (min-width: ${LG}px) {
        grid-template-columns: minmax(230px, auto) 1fr;
    }
`

const Column = styled.div`
    color: var(--fontColor);
    font-size: 12px;
    line-height: 48px;
    padding: 0 1.5rem;
    white-space: nowrap;

    strong {
        color: #323232;
        font-family: var(--sans);
        font-weight: 500;
        letter-spacing: 0;
        text-transform: none;
    }

    &:last-child {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        border-left: 1px solid #EBEBEB;
    }

    &:empty::after {
        content: ' ';
        white-space: pre;
    }

    @media (min-width: ${MD}px) {
        font-size: 14px;
        line-height: 56px;
    }
`

const DataTable = styled.div`
    width: 100%;
    margin: 0;
    overflow: hidden;
`

const ErrorNotice = styled.p`
    font-size: 12px;
    color: #808080;
    margin: 0 1rem;
`

export type DataPoint = {
    data: any,
    metadata: {
        messageId: {
            streamId: StreamId,
            timestamp: number,
        },
    }
}

type Props = {
    streamId: ?StreamId,
    selectedDataPoint: ?DataPoint,
    onSelectDataPoint: (DataPoint, ?boolean) => void,
    run?: boolean,
    hasData?: () => void,
}

const LOCAL_DATA_LIST_LENGTH = 5

const prettyPrintData = (data: ?{}, compact: boolean = false) => stringifyObject(data, {
    indent: '  ',
    inlineCharacterLimit: compact ? Infinity : 5,
})

const initialState = Array(LOCAL_DATA_LIST_LENGTH).fill(undefined)

const PreviewTable = ({
    streamId,
    selectedDataPoint,
    onSelectDataPoint,
    hasData,
    run = true,
}: Props) => {
    const dataRef = useRef([])
    const [visibleData, setVisibleData] = useState(initialState)
    const [dataReceived, setDataReceived] = useState(false)
    const [dataError, setDataError] = useState(false)
    const { hasLoaded, client } = useContext(ClientContext)
    const isMounted = useIsMounted()

    const updateDataToState = useThrottled(useCallback((data) => {
        setDataReceived(true)
        setVisibleData([...data])

        if (!selectedDataPoint && data.length) {
            onSelectDataPoint(data[0], true)
        }
    }, [selectedDataPoint, onSelectDataPoint]), 100)

    const hasDataRef = useRef(hasData)
    hasDataRef.current = hasData
    useEffect(() => {
        if (!!dataReceived && hasDataRef.current) {
            hasDataRef.current()
        }
    }, [dataReceived])

    const onData = useCallback((data, metadata) => {
        if (!isMounted()) { return }

        const dataPoint: DataPoint = {
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
            setVisibleData(initialState)
            dataRef.current = initialState
            setDataReceived(false)
        }
    }, [isMounted])

    const onError = useCallback(() => {
        if (isMounted()) {
            setDataError(true)
        }
    }, [isMounted])

    return (
        <SubscriptionStatusProvider>
            <Subscription
                uiChannel={{
                    id: streamId,
                }}
                resendLast={LOCAL_DATA_LIST_LENGTH}
                onSubscribed={onSub}
                isActive={run}
                onMessage={onData}
                onErrorMessage={onError}
            />
            <div>
                <DataTable>
                    <Row>
                        <Column>
                            <Translate
                                value="streamLivePreview.timestamp"
                                tag="strong"
                            />
                        </Column>
                        <Column>
                            <Translate
                                value="streamLivePreview.data"
                                tag="strong"
                            />
                        </Column>
                    </Row>
                    {visibleData.map((d, index) => {
                        if (!d) {
                            return (
                                // eslint-disable-next-line react/no-array-index-key
                                <Row key={index}>
                                    <Column />
                                    <Column />
                                </Row>
                            )
                        }

                        return (
                            <Row
                                key={JSON.stringify(d.metadata.messageId)}
                                onClick={() => onSelectDataPoint(d)}
                                highlight
                            >
                                <Column>
                                    {formatDateTime(d.metadata && d.metadata.messageId && d.metadata.messageId.timestamp, tz)}
                                </Column>
                                <Column>
                                    {prettyPrintData(d.data, true)}
                                </Column>
                            </Row>
                        )
                    })}
                </DataTable>
                {hasLoaded && !client && (
                    <ErrorNotice>
                        <Translate value="streamLivePreview.subscriptionErrorNotice" />
                    </ErrorNotice>
                )}
                {dataError && (
                    <ErrorNotice>
                        <Translate value="streamLivePreview.dataErrorNotice" />
                    </ErrorNotice>
                )}
            </div>
        </SubscriptionStatusProvider>
    )
}

export default PreviewTable
