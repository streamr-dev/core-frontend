import React, { useState, useMemo, useEffect } from 'react'
import styled, { css } from 'styled-components'
import stringifyObject from 'stringify-object'
import moment from 'moment-timezone'
import { Translate, I18n } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import { SM, LG } from '$shared/utils/styled'
import Tooltip from '$shared/components/Tooltip'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import Skeleton from '$shared/components/Skeleton'
import useCopy from '$shared/hooks/useCopy'
import { formatDateTime } from '$mp/utils/time'
import Selector from './Selector'
import IconButton from './IconButton'
import CloseButton from './CloseButton'
import Toolbar from './Toolbar'
import Columns from './Columns'
import Feed from './Feed'
import Foot from './Foot'
import Head from './Head'

import {
    SecurityIcon,
    getSecurityLevel,
    getSecurityLevelTitle,
} from '$userpages/components/StreamPage/Edit/SecurityView'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

const Container = styled.div`
    position: relative;
    height: 100%;
    background-color: white;
    color: #525252;
`

const StyledSecurityIcon = styled(SecurityIcon)`
    width: 16px;
    height: 16px;
`

const StyledButton = styled(Button)`
    && {
        font-size: 12px;
        height: 32px;
        min-width: 80px;
    }

    @media (min-width: ${SM}px) {
        && {
            min-width: 125px;
        }
    }
`

const StreamSettingsButton = styled(StyledButton)`
    @media (max-width: ${LG - 1}px) {
        && {
            display: none;
        }
    }
`

const MobileText = styled(Translate)`
    @media (min-width: ${SM}px) {
        display: none;
    }
`

const TabletText = styled(Translate)`
    display: none;

    @media (min-width: ${SM}px) {
        display: inline-block;
    }
`

const Cell = styled.div`
    font-size: 14px;
    line-height: normal;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const MobileInspectorPanel = styled.div`
    position: fixed;
    bottom: 0;
    height: 80px;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 24px;

    @media (min-width: ${SM}px) {
        display: none;
    }
`

const InspectorButton = styled(IconButton)`
    width: 32px;
    height: 32px;
    text-align: center;
    position: relative;
    border: none;
    background: none;
    appearance: none;
    border-radius: 2px;
    color: #CDCDCD;

    &:hover,
    &:active,
    &:focus {
        background-color: #EFEFEF;
        color: #525252;
    }

    ${({ active }) => !!active && css`
        background-color: #EFEFEF;
        color: #525252;
    `}
`

const ErrorNotice = styled.div`
    flex: 1;
    font-size: 12px;
    color: #808080;
    margin: 16px 24px;

    @media (min-width: ${SM}px) {
        margin: 16px 32px 16px 40px;
    }

    p {
        margin: 0;
        line-height: 1.5rem;
    }
`

const formatValue = (data) => {
    if (typeof data === 'object') {
        return stringifyObject(data, {
            inlineCharacterLimit: Infinity,
        })
    }
    return data.toString()
}

const tz = moment.tz.guess()

const UnstyledStreamPreview = ({
    className,
    streamId,
    stream,
    navigableStreamIds = [streamId],
    onChange: onStreamChangeProp,
    titlePrefix,
    onStreamSettings,
    streamData,
    onClose: onCloseProp,
    activePartition = 0,
    onPartitionChange,
    loading = false,
    subscriptionError,
    dataError,
}) => {
    const [inspectorFocused, setInspectorFocused] = useState(false)
    const [selectedDataPoint, setSelectedDataPoint] = useState(undefined)
    const { copy, isCopied } = useCopy()

    const streamLoaded = !!(stream && stream.id === streamId)
    const { description, partitions } = stream || {}

    const partitionOptions = useMemo(() => {
        if (!partitions) {
            return undefined
        }

        return [...new Array(partitions)].map((value, index) => index)
    }, [partitions])

    useEffect(() => {
        setSelectedDataPoint(undefined)
    }, [streamId])

    const linkToStreamSettings = useMemo(() => (
        !!onStreamSettings && typeof onStreamSettings === 'function' && onStreamSettings
    ), [onStreamSettings])

    const [activeDataId, activeTimestamp] = useMemo(() => {
        const { metadata } = selectedDataPoint || {}
        return [
            metadata && JSON.stringify(selectedDataPoint.metadata.messageId),
            metadata && metadata.messageId.timestamp,
        ]
    }, [selectedDataPoint])

    const selection = Object.entries((selectedDataPoint || {}).data || {})

    const [x, setX] = useState(504)

    return (
        <div
            className={className}
            style={{
                '--LiveDataInspectorWidth': `${x}px`,
            }}
        >
            <Head>
                <CloseButton.Wrapper>
                    <CloseButton onClick={onCloseProp} />
                </CloseButton.Wrapper>
                <Head.Inner>
                    <div>
                        <h1 title={streamId}>
                            <Skeleton disabled={streamLoaded}>
                                <span>{titlePrefix}</span>
                                {streamId}
                            </Skeleton>
                        </h1>
                        <p title={description}>
                            <Skeleton disabled={streamLoaded}>
                                {description}
                            </Skeleton>
                        </p>
                    </div>
                </Head.Inner>
            </Head>
            <Toolbar>
                <Toolbar.Lhs>
                    <div>
                        <Selector
                            title={I18n.t('streamLivePreview.streams')}
                            options={navigableStreamIds || []}
                            active={streamId}
                            onChange={onStreamChangeProp}
                        />
                    </div>
                    <div>
                        <Selector
                            title={I18n.t('streamLivePreview.partitions')}
                            options={partitionOptions || []}
                            active={activePartition}
                            onChange={onPartitionChange}
                        />
                    </div>
                </Toolbar.Lhs>
                <Toolbar.Rhs>
                    <div>
                        {!!linkToStreamSettings && (
                            <StreamSettingsButton
                                kind="secondary"
                                disabled={!streamLoaded}
                                onClick={() => onStreamSettings(streamId)}
                            >
                                <Translate value="streamLivePreview.streamSettings" />
                            </StreamSettingsButton>
                        )}
                        <StyledButton
                            kind="secondary"
                            onClick={() => copy(streamId)}
                            disabled={!streamLoaded}
                        >
                            {isCopied ? (
                                <Translate value="streamLivePreview.streamIdCopied" />
                            ) : (
                                <React.Fragment>
                                    <TabletText value="streamLivePreview.copyStreamId" />
                                    <MobileText value="streamLivePreview.copyStreamIdMobile" />
                                </React.Fragment>
                            )}
                        </StyledButton>
                    </div>
                </Toolbar.Rhs>
            </Toolbar>
            <LoadingIndicator loading={!streamLoaded || !!loading} />
            <Columns>
                <Columns.Lhs>
                    <Translate value="streamLivePreview.timestamp" />
                    <Translate value="streamLivePreview.data" />
                </Columns.Lhs>
                <Columns.Rhs>
                    <Translate value="streamLivePreview.inspector" />
                </Columns.Rhs>
                <Columns.Handle onDrag={setX} />
            </Columns>
            <Feed>
                <Feed.Lhs>
                    {!!streamLoaded && (streamData || []).map((d) => {
                        if (!d) {
                            return null
                        }

                        const { metadata, data } = d

                        const msgId = JSON.stringify(metadata.messageId)

                        const Tag = activeDataId === msgId ? 'strong' : 'span'

                        return (
                            <Feed.Row
                                key={msgId}
                                active={activeDataId === msgId}
                                onClick={() => setSelectedDataPoint(d)}
                            >
                                <Tag>
                                    <Feed.Cell>
                                        {formatDateTime(metadata && metadata.messageId && metadata.messageId.timestamp, tz)}
                                    </Feed.Cell>
                                </Tag>
                                <Tag>
                                    <Feed.Cell>
                                        {JSON.stringify(data)}
                                    </Feed.Cell>
                                </Tag>
                            </Feed.Row>
                        )
                    })}
                </Feed.Lhs>
                <Feed.Rhs>
                    <Feed.Row>
                        <div>
                            <Translate value="streamLivePreview.security" />
                        </div>
                        <div>
                            <Tooltip
                                value={getSecurityLevelTitle(stream)}
                                placement={Tooltip.BOTTOM}
                            >
                                <StyledSecurityIcon
                                    level={getSecurityLevel(stream)}
                                    mode="small"
                                />
                            </Tooltip>
                        </div>
                    </Feed.Row>
                    {!!activeTimestamp && (
                        <Feed.Row>
                            <div>
                                <Translate value="streamLivePreview.timestamp" />
                            </div>
                            <div>
                                <Feed.Cell>
                                    {formatDateTime(activeTimestamp, tz)}
                                </Feed.Cell>
                            </div>
                        </Feed.Row>
                    )}
                    {selection.map(([k, v]) => {
                        const value = formatValue(v)

                        return (
                            <Feed.Row key={`${k}${value}`}>
                                <div>
                                    <Feed.Cell>{k}</Feed.Cell>
                                </div>
                                <div>
                                    <Feed.Cell>{value}</Feed.Cell>
                                </div>
                            </Feed.Row>
                        )
                    })}
                </Feed.Rhs>
            </Feed>
            <Foot />
        </div>
    )

    // eslint-disable-next-line no-unreachable
    return (
        <Container>
            {/* <Inspector inspectorFocused={inspectorFocused}>
                {(!!subscriptionError || dataError) && (
                    <ErrorNotice>
                        {!!subscriptionError && (
                            <p>{subscriptionError}</p>
                        )}
                        {!!dataError && (
                            <p>{dataError}</p>
                        )}
                    </ErrorNotice>
                )}
            </Inspector> */}
            <MobileInspectorPanel>
                <InspectorButton
                    active={!inspectorFocused}
                    onClick={() => setInspectorFocused(false)}
                >
                    <SvgIcon name="list" />
                </InspectorButton>
                <InspectorButton
                    active={!!inspectorFocused}
                    onClick={() => setInspectorFocused(true)}
                >
                    <SvgIcon name="listInspect" />
                </InspectorButton>
            </MobileInspectorPanel>
        </Container>
    )
}

const StreamPreview = styled(UnstyledStreamPreview)`
    background: #ffffff;
    color: #323232;
    display: flex;
    flex-direction: column;
    height: 100%;
`

export default StreamPreview
