import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import { formatDateTime } from '$mp/utils/time'
import Tooltip from '$shared/components/Tooltip'
import { Translate } from 'react-redux-i18n'
import {
    SecurityIcon as PrestyledSecurityIcon,
    getSecurityLevel,
    getSecurityLevelTitle,
} from '$userpages/components/StreamPage/Edit/SecurityView'

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

const Row = styled.div`
    border-bottom: 1px solid #efefef;
    box-sizing: content-box;
    display: grid;
    line-height: 28px;
    padding: 14px 16px;
    transition: 250ms background-color;

    :hover {
        transition-duration: 25ms;
    }
`

const Lhs = styled.div`
    height: 100%;
    left: 0;
    overflow: auto;
    position: absolute;
    right: var(--LiveDataInspectorWidth, 504px);
    top: 0;

    ${Row} {
        grid-template-columns: 360px 1fr;
        /* margin-left: calc((100vw - var(--LiveDataInspectorWidth, 504px) - 1108px - 32px) / 2); */
        width: 1108px;
    }

    ${Row}:hover {
        background: #fafafa;
    }
`

const Rhs = styled.div`
    background: #fafafa;
    border-left: 1px solid #efefef;
    height: 100%;
    overflow: auto;
    position: absolute;
    right: 0;
    top: 0;
    width: var(--LiveDataInspectorWidth, 504px);

    ${Row} {
        grid-template-columns: 164px 1fr;
        column-gap: 8px;
        margin: 0 24px;
    }

    ${Row}:hover {
        background: #f3f3f3;
    }
`

const Cell = styled.span`
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
                            <Tag>
                                <Cell>
                                    {formatDateTime(d.metadata && d.metadata.messageId && d.metadata.messageId.timestamp, tz)}
                                </Cell>
                            </Tag>
                            <Tag>
                                <Cell>
                                    {JSON.stringify(d.data)}
                                </Cell>
                            </Tag>
                        </Row>
                    )
                })}
            </Lhs>
            <Rhs>
                <Row>
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
                </Row>
                {!!selectedTimestamp && (
                    <Row>
                        <div>
                            <Translate value="streamLivePreview.timestamp" />
                        </div>
                        <div>
                            <Cell>
                                {formatDateTime(selectedTimestamp, tz)}
                            </Cell>
                        </div>
                    </Row>
                )}
                {selection.map(([k, v]) => {
                    const value = formatValue(v)

                    return (
                        <Row key={`${k}${value}`}>
                            <div>
                                <Cell>{k}</Cell>
                            </div>
                            <div>
                                <Cell>{value}</Cell>
                            </div>
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
