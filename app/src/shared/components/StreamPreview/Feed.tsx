import React, { useState, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import { Tooltip } from '@streamr/streamr-layout'
import { formatDateTime } from '$mp/utils/time'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'
import { DESKTOP, TABLET } from '$shared/utils/styled'
import Layout from './Layout'
import Cell from './Cell'
import ResizeHandle from './ResizeHandle'
import Toolbar from './Toolbar'

const formatValue = (data) =>
    typeof data === 'object'
        ? stringifyObject(data, {
            inlineCharacterLimit: Number.POSITIVE_INFINITY,
        })
        : data.toString()

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr max(var(--LiveDataInspectorMinWidth), var(--LiveDataInspectorWidth));


    margin: 0 auto;
    padding: 0 24px;
    & & {
        padding: 0 24px;
    }
    @media (${DESKTOP}) {
        padding: 0 32px;
    }
    @media (${TABLET}) {
        max-width: 1360px;
        padding: 0 24px;

        & & {
            padding: 0;
        }
    }
`

const Inner = styled.div`
    display: grid;
    line-height: 28px;
    padding: 14px 16px;

    > div {
        min-width: 0;
    }
`
const ToolbarFiller = styled.div`
    background: #fafafa;
    border-left: 1px solid #efefef;
`

const Row = styled.div``
const Viewport = styled.div`
    height: 100%;
    overflow: auto;

    ${Inner} {
        transition: 250ms background-color;
    }

    ${Inner}:hover {
        transition-duration: 25ms;
    }
`
const Header = styled.div`
    height: 54px;
    //position: absolute;
    //top: 0;
    width: 100%;
`
const Side = styled.div`
    height: 100%;
    overflow: hidden;
    //padding-top: 56px;
    //position: absolute;
    //top: 0;
`
const Lhs = styled(Side)`
    left: 0;
    right: 0;
    //width: 224px;

    /*
    @media (min-width: 668px) {
        max-width: calc(100vw - var(--LiveDataInspectorMinWidth));
        min-width: var(--LiveDataMinLhsWidth);
        width: calc(100vw - var(--LiveDataInspectorWidth));
    }
    */

    ${Row} {
        display: grid;
        grid-template-columns: auto 1fr;
    }

    ${Inner} {
        grid-template-columns: minmax(0, var(--LiveDataTimestampColumnMaxWidth)) 1fr;
        //max-width: 1108px;
    }

    ${Viewport} ${Inner}:hover {
        background: #fafafa;
    }

    ${Inner} > div {
        min-width: 0;
    }
`

type RhsProps = {
    focused: boolean,
}

const Rhs = styled(Side)<RhsProps>`
    background: #fafafa;
    border-left: 1px solid #efefef;
    transition: 0.2s left;

    ${({ focused }) =>
        !!focused &&
        css`
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

    ${Viewport} ${Inner} {
        border-bottom: 1px solid #efefef;
    }

    @media (min-width: 668px) {
        //max-width: calc(100vw - var(--LiveDataMinLhsWidth) + 1px);
        //min-width: var(--LiveDataInspectorMinWidth);
        //left: auto;
        //right: 0;
        transition: none;
        //width: var(--LiveDataInspectorWidth);

        ${Inner} {
            grid-template-columns: 164px 1fr;
        }
    }
`
const tz = moment.tz.guess()
const TooltipTheme = Object.assign({}, Tooltip.BottomTheme, {
    left: 0,
    top: 'auto',
    transform: 'none',
})

type Props = {
    className?: string,
    errorComponent?: React.ReactNode,
    inspectorFocused: boolean,
    stream: any,
    streamData: any,
    streamLoaded: boolean,
    onPartitionChange: (partition: number) => void,
    onSettingsButtonClick: (streamId: string) => void,
    onStreamChange: () => void,
    partition: number,
    partitions: Array<any>,
    streamId: string,
    streamIds: Array<string>,
}

const UnstyledFeed = ({
    className,
    errorComponent = null,
    inspectorFocused = false,
    stream,
    streamData,
    streamLoaded,
    onPartitionChange,
    onSettingsButtonClick,
    onStreamChange,
    partition,
    partitions = [],
    streamId,
    streamIds = [streamId],
}: Props) => {
    const [datapoint, setDatapoint] = useState()
    useEffect(() => {
        setDatapoint(undefined)
    }, [streamId])
    const { metadata, data } = datapoint || { metadata: null, data: null }
    const selectedMsgId = metadata && JSON.stringify(metadata.messageId)
    const selectedTimestamp = metadata && metadata.timestamp
    const selection = Object.entries(data || {})
    const { copy } = useCopy()
    const rowRef = useRef(null)
    const copyText = 'ontouchstart' in window ? 'Tap to copy' : 'Copy'

    const onCopyClick = (value) => (e) => {
        const prevRow = rowRef.current
        rowRef.current = e.currentTarget

        // Using touch screen and "focused" row does not much current row? Do nothing.
        if ('ontouchstart' in window && prevRow !== e.currentTarget) {
            return
        }

        // Value is not a string? Do nothing.
        if (typeof value !== 'string') {
            return
        }

        copy(value)
        Notification.push({
            title: 'Field data copied to clipboard',
            icon: NotificationIcon.CHECKMARK,
        })
    }

    return (
        <div className={className}>
            <Container>
                <Toolbar
                    onPartitionChange={onPartitionChange}
                    onSettingsButtonClick={onSettingsButtonClick}
                    onStreamChange={onStreamChange}
                    partition={partition}
                    partitions={partitions || []}
                    streamId={streamId}
                    streamIds={streamIds || []}
                />
                <ToolbarFiller />
            </Container>
            <Container>
                <Lhs>
                    <Header>
                        <Row>
                            <Layout.Pusher />
                            <Inner>
                                <Cell as="strong">Timestamp</Cell>
                                <Cell as="strong">Data</Cell>
                            </Inner>
                        </Row>
                    </Header>
                    <Viewport>
                        {!!streamLoaded &&
                            (streamData || []).map((d) => {
                                if (!d) {
                                    return null
                                }

                                const msgId = JSON.stringify(d.metadata.messageId)
                                const Tag = selectedMsgId === msgId ? 'strong' : 'span'
                                return (
                                    <Row
                                        key={msgId}
                                        onClick={() =>
                                            setDatapoint(
                                                (
                                                    current, // Same row clicked twice = toggle.
                                                ) => (d === current ? undefined : d),
                                            )
                                        }
                                    >
                                        <Layout.Pusher />
                                        <Inner>
                                            <Cell as={Tag}>
                                                {formatDateTime(
                                                    d.metadata && d.metadata.timestamp,
                                                    tz,
                                                )}
                                            </Cell>
                                            <Cell as={Tag}>{JSON.stringify(d.data)}</Cell>
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
                                        <Cell>Inspector</Cell>
                                    </strong>
                                </div>
                            </Inner>
                        </Row>
                    </Header>
                    <Viewport>
                        {!!selectedTimestamp && (
                            <Row>
                                <Inner as={Tooltip.Parent} onClick={onCopyClick(formatDateTime(selectedTimestamp, tz))}>
                                    <div>Timestamp</div>
                                    <div>
                                        <Tooltip value={copyText} placement={TooltipTheme}>
                                            <Cell>{formatDateTime(selectedTimestamp, tz)}</Cell>
                                        </Tooltip>
                                    </div>
                                </Inner>
                            </Row>
                        )}
                        {selection.map(([k, v]) => {
                            const value = formatValue(v)
                            return (
                                <Row key={`${k}${value}`}>
                                    <Inner as={Tooltip.Parent} onClick={onCopyClick(value)}>
                                        <div>
                                            <Cell>{k}</Cell>
                                        </div>
                                        <div>
                                            <Tooltip value={copyText} placement={TooltipTheme}>
                                                <Cell>{value}</Cell>
                                            </Tooltip>
                                        </div>
                                    </Inner>
                                </Row>
                            )
                        })}
                        {errorComponent}
                    </Viewport>
                </Rhs>
                <ResizeHandle />
            </Container>
        </div>
    )
}

const Feed = styled(UnstyledFeed)`
    flex-grow: 1;
    position: relative;

    ${Tooltip.Root} {
        display: inline;
        line-height: inherit;
    }
`
Object.assign(Feed, {
    Cell,
    Lhs,
    Rhs,
    Row,
})
export default Feed
