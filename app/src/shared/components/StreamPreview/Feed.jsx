import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import { Translate } from 'react-redux-i18n'
import { formatDateTime } from '$mp/utils/time'
import Tooltip from '$shared/components/Tooltip'
import {
    SecurityIcon as PrestyledSecurityIcon,
    getSecurityLevel,
    getSecurityLevelTitle,
} from '$userpages/components/StreamPage/Edit/SecurityView'
import Layout from './Layout'
import Cell from './Cell'

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
    border-bottom: 1px solid #efefef;
    display: grid;
    line-height: 28px;
    padding: 14px 16px;
    transition: 250ms background-color;

    :hover {
        transition-duration: 25ms;
    }
`

const Row = styled.div``

const Lhs = styled.div`
    height: 100%;
    left: 0;
    max-width: calc(100vw - 504px);
    min-width: var(--LiveDataMinLhsWidth);
    overflow: auto;
    position: absolute;
    right: 0;
    top: 0;
    width: calc(100vw - var(--LiveDataInspectorWidth));

    ${Row} {
        display: grid;
        grid-template-columns: auto 1fr;
    }

    ${Inner} {
        grid-template-columns: minmax(0, 360px) 1fr;
        max-width: 1108px;
    }

    ${Inner}:hover {
        background: #fafafa;
    }

    ${Inner} > div {
        min-width: 0;
    }
`

const Rhs = styled.div`
    background: #fafafa;
    border-left: 1px solid #efefef;
    height: 100%;
    max-width: calc(100vw - var(--LiveDataMinLhsWidth) + 1px);
    min-width: 504px;
    overflow: auto;
    position: absolute;
    right: 0;
    top: 0;
    width: var(--LiveDataInspectorWidth);

    ${Inner} {
        grid-template-columns: 164px 1fr;
        column-gap: 8px;
        margin: 0 24px;
    }

    ${Inner}:hover {
        background: #f3f3f3;
    }

    ${Inner} > div:first-child {
        color: #a3a3a3;
        text-transform: uppercase;
    }
`

const tz = moment.tz.guess()

const UnstyledFeed = ({ className, streamLoaded, streamData, stream }) => {
    const [datapoint, setDatapoint] = useState()

    useEffect(() => {
        setDatapoint(undefined)
    }, [stream.id])

    const { metadata, data } = datapoint || {}

    const selectedMsgId = metadata && JSON.stringify(metadata.messageId)

    const selectedTimestamp = metadata && metadata.messageId.timestamp

    const selection = Object.entries(data || {})

    return (
        <div className={className}>
            <Lhs>
                {!!streamLoaded && (streamData || []).map((d) => {
                    if (!d) {
                        return null
                    }

                    const msgId = JSON.stringify(d.metadata.messageId)

                    const Tag = selectedMsgId === msgId ? 'strong' : 'span'

                    return (
                        <Row
                            key={msgId}
                            onClick={() => setDatapoint(d)}
                        >
                            <Layout.Pusher minWidth={92} />
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
            </Lhs>
            <Rhs>
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
                                    level={getSecurityLevel(stream)}
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
            </Rhs>
        </div>
    )
}

const Feed = styled(UnstyledFeed)`
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
