import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import { I18n, Translate } from 'react-redux-i18n'
import { formatDateTime } from '$mp/utils/time'
import Tooltip from '$shared/components/Tooltip'
import {
    SecurityIcon as PrestyledSecurityIcon,
    getSecurityLevel,
    getSecurityLevelTitle,
} from '$userpages/components/StreamPage/Edit/SecurityView'
import Layout from './Layout'
import Cell from './Cell'
import ResizeHandle from './ResizeHandle'

const formatValue = (data) => (
    typeof data === 'object' ? (
        stringifyObject(data, {
            inlineCharacterLimit: Number.POSITIVE_INFINITY,
        })
    ) : data.toString()
)

const SecurityIcon = styled(PrestyledSecurityIcon)`
    height: 16px;
    width: 16px;
`

const Inner = styled.div`
    display: grid;
    line-height: 28px;
    padding: 14px 16px;

    > div {
        min-width: 0;
    }
`

const Row = styled.div``

const Viewport = styled.div`
    height: 100%;
    overflow: auto;

    ${Inner} {
        border-bottom: 1px solid #efefef;
        transition: 250ms background-color;
    }

    ${Inner}:hover {
        transition-duration: 25ms;
    }
`

const Header = styled.div`
    height: 54px;
    position: absolute;
    top: 0;
    width: 100%;

    ${Row} {
        border-bottom: 1px solid #efefef;
    }
`

const Side = styled.div`
    height: 100%;
    overflow: hidden;
    padding-top: 56px;
    position: absolute;
    top: 0;
`

const Lhs = styled(Side)`
    left: 0;
    right: 0;
    width: 224px;

    @media (min-width: 668px) {
        max-width: calc(100vw - var(--LiveDataInspectorMinWidth));
        min-width: var(--LiveDataMinLhsWidth);
        width: calc(100vw - var(--LiveDataInspectorWidth));
    }

    ${Row} {
        display: grid;
        grid-template-columns: auto 1fr;
    }

    ${Inner} {
        grid-template-columns: minmax(0, var(--LiveDataTimestampColumnMaxWidth)) 1fr;
        max-width: 1108px;
    }

    ${Viewport} ${Inner}:hover {
        background: #fafafa;
    }

    ${Inner} > div {
        min-width: 0;
    }
`

const Rhs = styled(Side)`
    background: #fafafa;
    border-left: 1px solid #efefef;
    left: 224px;
    transition: 0.2s left;
    width: 100vw;

    ${({ focused }) => !!focused && css`
        left: 0;
    `}

    ${Inner} {
        grid-template-columns: 128px 1fr;
        column-gap: 8px;
        margin: 0 24px;
    }

    ${Viewport} ${Inner}:hover {
        background: #f3f3f3;
    }

    ${Viewport} ${Inner} > div:first-child {
        color: #a3a3a3;
        text-transform: uppercase;
    }

    @media (min-width: 668px) {
        max-width: calc(100vw - var(--LiveDataMinLhsWidth) + 1px);
        min-width: var(--LiveDataInspectorMinWidth);
        left: auto;
        right: 0;
        transition: none;
        width: var(--LiveDataInspectorWidth);

        ${Inner} {
            grid-template-columns: 164px 1fr;
        }
    }
`

const tz = moment.tz.guess()

const UnstyledFeed = ({
    className,
    errorComponent = null,
    inspectorFocused = false,
    stream,
    streamData,
    streamLoaded,
}) => {
    const [datapoint, setDatapoint] = useState()

    const streamId = stream ? stream.id : undefined

    useEffect(() => {
        setDatapoint(undefined)
    }, [streamId])

    const { metadata, data } = datapoint || {}

    const selectedMsgId = metadata && JSON.stringify(metadata.messageId)

    const selectedTimestamp = metadata && metadata.messageId.timestamp

    const selection = Object.entries(data || {})

    return (
        <div className={className}>
            <Lhs>
                <Header>
                    <Row>
                        <Layout.Pusher />
                        <Inner>
                            <Cell as="strong">
                                <Translate value="streamLivePreview.timestamp" />
                            </Cell>
                            <Cell as="strong">
                                <Translate value="streamLivePreview.data" />
                            </Cell>
                        </Inner>
                    </Row>
                </Header>
                <Viewport>
                    {!!streamLoaded && (streamData || []).map((d) => {
                        if (!d) {
                            return null
                        }

                        const msgId = JSON.stringify(d.metadata.messageId)

                        const Tag = selectedMsgId === msgId ? 'strong' : 'span'

                        return (
                            <Row
                                key={msgId}
                                onClick={() => setDatapoint((current) => (
                                    d === current ? undefined : d
                                ))}
                            >
                                <Layout.Pusher />
                                <Inner>
                                    <Cell as={Tag}>
                                        {formatDateTime(d.metadata && d.metadata.messageId && d.metadata.messageId.timestamp, tz)}
                                    </Cell>
                                    <Cell as={Tag}>
                                        {JSON.stringify(d.data)}
                                    </Cell>
                                </Inner>
                            </Row>
                        )
                    })}
                </Viewport>
            </Lhs>
            <Rhs focused={inspectorFocused}>
                <Header>
                    <Row>
                        <Inner>
                            <div>
                                <strong>
                                    <Cell>
                                        {I18n.t('streamLivePreview.inspector')}
                                    </Cell>
                                </strong>
                            </div>
                        </Inner>
                    </Row>
                </Header>
                <Viewport>
                    <Row>
                        <Inner>
                            <div>
                                <Translate value="streamLivePreview.security" />
                            </div>
                            <div>
                                <Tooltip
                                    value={getSecurityLevelTitle(stream)}
                                    placement={Tooltip.BOTTOM}
                                >
                                    <SecurityIcon
                                        level={getSecurityLevel(stream || {})}
                                        mode="small"
                                    />
                                </Tooltip>
                            </div>
                        </Inner>
                    </Row>
                    {!!selectedTimestamp && (
                        <Row>
                            <Inner>
                                <div>
                                    <Translate value="streamLivePreview.timestamp" />
                                </div>
                                <div>
                                    <Cell>
                                        {formatDateTime(selectedTimestamp, tz)}
                                    </Cell>
                                </div>
                            </Inner>
                        </Row>
                    )}
                    {selection.map(([k, v]) => {
                        const value = formatValue(v)

                        return (
                            <Row key={`${k}${value}`}>
                                <Inner>
                                    <div>
                                        <Cell>{k}</Cell>
                                    </div>
                                    <div>
                                        <Cell>{value}</Cell>
                                    </div>
                                </Inner>
                            </Row>
                        )
                    })}
                    {errorComponent}
                </Viewport>
            </Rhs>
            <ResizeHandle />
        </div>
    )
}

const Feed = styled(UnstyledFeed)`
    border: 1px solid #efefef;
    flex-grow: 1;
    position: relative;
`

Object.assign(Feed, {
    Cell,
    Lhs,
    Rhs,
    Row,
})

export default Feed
