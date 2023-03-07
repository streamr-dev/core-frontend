import React, { useState, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import moment from 'moment-timezone'
import stringifyObject from 'stringify-object'
import { Tooltip } from '@streamr/streamr-layout'
import { formatDateTime } from '$mp/utils/time'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'
import {COLORS, MAX_BODY_WIDTH, TABLET} from '$shared/utils/styled'
import Button from '$shared/components/Button'
import Layout from './Layout'
import Cell from './Cell'
import Toolbar from './Toolbar'

const formatValue = (data) =>
    typeof data === 'object'
        ? stringifyObject(data, {
            inlineCharacterLimit: Number.POSITIVE_INFINITY,
        })
        : data.toString()

type ContainerProps = {
    inspectorFocused: boolean,
}

const Container = styled.div<ContainerProps>`
    display: grid;
    transition: 0.2s grid-template-columns;
    grid-template-columns: auto 248px 1fr auto;

    ${({ inspectorFocused }) =>
        !!inspectorFocused &&
        css`
            grid-template-columns: auto 0px 1fr auto;
        `}

    @media ${TABLET} {
        grid-template-columns: auto 1fr 1fr auto;
    }

    @media (min-width: ${MAX_BODY_WIDTH}px) {
        grid-template-columns: auto ${MAX_BODY_WIDTH - 560}px 560px auto;
    }
`

const FillContainer = styled(Container)`
    flex-grow: 1;
`

const LeftFiller = styled.div`
    background: #ffffff;
`

const RightFiller = styled.div`
    background: #fafafa;
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
        transition: 250ms background-color;
    }

    ${Inner}:hover {
        transition-duration: 25ms;
    }
`
const Header = styled.div`
    height: 54px;
    width: 100%;
`
const Side = styled.div`
    height: 100%;
    overflow: hidden;
`

const Lhs = styled(Side)`
    ${Row} {
        display: grid;
        grid-template-columns: auto 1fr;
    }

    ${Inner} {
        grid-template-columns: 224px 1fr;
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
        transition: none;

        ${Inner} {
            grid-template-columns: 164px 1fr;
        }
    }
`

const GetAccessDialog = styled.div`
    padding: 32px 24px;
    display: grid;
    grid-template-rows: 40px 56px auto;
    border: 1px solid ${COLORS.dialogBorder};
    border-radius: 8px;
    margin-top: 50px;
    width: 560px;

    > button {
        width: fit-content;
    }
`

const Title = styled.div`
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.01em;
    color: #000000;
`

const Description = styled.div`
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.01em;
    color: #000000;
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
    hasSubscribePermission: boolean,
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
    hasSubscribePermission,
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
            <Container inspectorFocused={inspectorFocused}>
                <LeftFiller />
                <Lhs>
                    <Toolbar
                        onPartitionChange={onPartitionChange}
                        onSettingsButtonClick={onSettingsButtonClick}
                        onStreamChange={onStreamChange}
                        partition={partition}
                        partitions={partitions || []}
                        streamId={streamId}
                        streamIds={streamIds || []}
                    />
                </Lhs>
                <Rhs />
                <RightFiller />
            </Container>
            <Container inspectorFocused={inspectorFocused}>
                <LeftFiller />
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
                <Rhs>
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
                <RightFiller />
            </Container>
            <FillContainer inspectorFocused={inspectorFocused}>
                <LeftFiller />
                <Lhs>
                    {!hasSubscribePermission && (
                        <GetAccessDialog>
                            <Title>Get access to unlock</Title>
                            <Description>Please get access to this project to unlock stream live data</Description>
                            <Button
                                type="button"
                            >
                                TODO: Get access
                            </Button>
                        </GetAccessDialog>
                    )}
                </Lhs>
                <Rhs />
                <RightFiller />
            </FillContainer>
        </div>
    )
}

const Feed = styled(UnstyledFeed)`
    flex-grow: 1;
    position: relative;
    display: flex;
    flex-direction: column;

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
