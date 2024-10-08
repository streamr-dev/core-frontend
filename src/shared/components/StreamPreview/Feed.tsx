import { Tooltip } from '@streamr/streamr-layout'
import moment from 'moment-timezone'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import stringifyObject from 'stringify-object'
import styled, { css } from 'styled-components'
import { CopyButton } from '~/components/CopyButton'
import { SelectField2 } from '~/marketplace/components/SelectField2'
import { formatDateTime } from '~/marketplace/utils/time'
import useCopy from '~/shared/hooks/useCopy'
import { COLORS, MAX_BODY_WIDTH, MEDIUM, TABLET } from '~/shared/utils/styled'
import { truncateStreamName } from '~/shared/utils/text'
import { DataPoint } from '~/types'
import Cell from './Cell'
import Layout from './Layout'
import { ModalStreamSelector } from './ModalStreamSelector'
import Toolbar from './Toolbar'

const formatValue = (data) =>
    typeof data === 'object'
        ? stringifyObject(data, {
              inlineCharacterLimit: Number.POSITIVE_INFINITY,
          })
        : data.toString()

type ContainerProps = {
    inspectorFocused: boolean
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
    &.no-overflow-desktop {
        @media (${TABLET}) {
            overflow: initial;
        }
    }
`

const Lhs = styled(Side)`
    ${Row} {
        display: grid;
        grid-template-columns: auto 1fr;
        border-bottom: 1px solid ${COLORS.Border};
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

    @media (${TABLET}) {
        transition: none;

        ${Inner} {
            grid-template-columns: 164px 1fr;
        }
    }
`

const ToolbarContainer = styled.div`
    border-bottom: 1px solid ${COLORS.Border};
`

const tz = moment.tz.guess()
const TooltipTheme = Object.assign({}, Tooltip.BottomTheme, {
    left: 0,
    top: 'auto',
    transform: 'none',
})

const StreamSelectorContainer = styled.div`
    padding: 14px 16px;
    .select-stream-label {
        margin-bottom: 8px;
        font-weight: ${MEDIUM};
    }
`

const StreamSelector = styled.div`
    align-items: center;
    display: flex;
    gap: 8px;
`

const DesktopStreamSelector = styled.div`
    display: none;
    @media (${TABLET}) {
        display: block;
    }
`

const MobileStreamSelector = styled.div`
    background-color: ${COLORS.secondary};
    padding: 24px;
    @media (${TABLET}) {
        display: none;
    }
    .label {
        font-weight: ${MEDIUM};
        margin-bottom: 8px;
    }
    .selector {
        align-items: center;
        display: flex;
        gap: 8px;
        margin-bottom: 5px;
    }
`

const DesktopToolbar = styled(Toolbar)`
    display: none;
    @media (${TABLET}) {
        display: block;
    }
`

type Props = {
    className?: string
    errorComponent?: React.ReactNode
    inspectorFocused: boolean
    streamData: any
    streamLoaded: boolean
    onPartitionChange: (partition: number) => void
    onSettingsButtonClick?: (streamId: string) => void
    onStreamChange: (streamId: string) => void
    partition: number
    partitions: Array<any>
    streamId: string
    streamIds: Array<string>
}

const UnstyledFeed = ({
    className,
    errorComponent = null,
    inspectorFocused = false,
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
    const [datapoint, setDatapoint] = useState<DataPoint>()
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
    const streamOptions = useMemo(
        () => streamIds.map((id) => ({ value: id, label: truncateStreamName(id) })),
        [streamIds],
    )

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

        copy(value, {
            toastMessage: 'Field data copied to clipboard',
        })
    }

    return (
        <div className={className}>
            {streamOptions.length > 1 && (
                <MobileStreamSelector>
                    <p className={'label'}>Select a Stream</p>
                    <div className={'selector'}>
                        <ModalStreamSelector
                            streamIds={streamIds}
                            selectedStream={streamId}
                            onChange={onStreamChange}
                        />
                        <CopyButton value={streamId} />
                    </div>
                </MobileStreamSelector>
            )}
            <Container inspectorFocused={inspectorFocused}>
                <LeftFiller />
                <Lhs className={'no-overflow-desktop'}>
                    {(streamOptions.length > 1 ||
                        (partitions != null && partitions.length > 1)) && (
                        <ToolbarContainer>
                            {streamOptions.length > 1 && (
                                <DesktopStreamSelector>
                                    <StreamSelectorContainer>
                                        <p className={'select-stream-label'}>
                                            Select a stream
                                        </p>
                                        <StreamSelector>
                                            <SelectField2
                                                placeholder={'Select Stream'}
                                                options={streamOptions}
                                                onChange={onStreamChange}
                                                isClearable={false}
                                                value={streamId}
                                            />
                                            <CopyButton value={streamId} />
                                        </StreamSelector>
                                    </StreamSelectorContainer>
                                </DesktopStreamSelector>
                            )}
                            <DesktopToolbar
                                onPartitionChange={onPartitionChange}
                                onSettingsButtonClick={onSettingsButtonClick}
                                partition={partition}
                                partitions={partitions || []}
                                streamId={streamId}
                            />
                        </ToolbarContainer>
                    )}
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
                                <Inner
                                    as={Tooltip.Parent}
                                    onClick={onCopyClick(
                                        formatDateTime(selectedTimestamp, tz),
                                    )}
                                >
                                    <div>Timestamp</div>
                                    <div>
                                        <Tooltip
                                            value={copyText}
                                            placement={TooltipTheme}
                                        >
                                            <Cell>
                                                {formatDateTime(selectedTimestamp, tz)}
                                            </Cell>
                                        </Tooltip>
                                    </div>
                                </Inner>
                            </Row>
                        )}
                        {selection.map(([k, v]) => {
                            const value = formatValue(v)
                            return (
                                <Row key={`${k}${value}`}>
                                    <Inner
                                        as={Tooltip.Parent}
                                        onClick={onCopyClick(value)}
                                    >
                                        <div>
                                            <Cell>{k}</Cell>
                                        </div>
                                        <div>
                                            <Tooltip
                                                value={copyText}
                                                placement={TooltipTheme}
                                            >
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
        </div>
    )
}

const Feed = styled(UnstyledFeed)`
    flex-grow: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    padding-bottom: 80px;
    @media (${TABLET}) {
        padding-bottom: 0;
    }

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
