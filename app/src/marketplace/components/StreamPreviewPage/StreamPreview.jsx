import React, { useState, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'

import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import { MD, LG } from '$shared/utils/styled'
import Tooltip from '$shared/components/Tooltip'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import Skeleton from '$shared/components/Skeleton'
import useCopy from '$shared/hooks/useCopy'

import {
    SecurityIcon,
    getSecurityLevel,
    getSecurityLevelTitle,
} from '$userpages/components/StreamPage/Edit/SecurityView'

const Container = styled.div`
    position: relative;
    height: 100%;
`

const IconButton = styled.button`
    width: 32px;
    height: 32px;
    text-align: center;
    position: relative;
    border: none;
    background: none;
    appearance: none;
    border-radius: 2px;

    &:not(:disabled):hover,
    &:focus {
        background-color: #EFEFEF;
        outline: none;
    }

    &:not(:disabled):active {
        background-color: #D8D8D8;
    }

    svg {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    & + & {
        margin-left: 32px;
    }
`

const CloseButton = styled(IconButton)`
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 1;

    svg {
        width: 10px;
        height: 10px;
    }
`

const StyledLoadingIndicator = styled(LoadingIndicator)`
    position: fixed;
    top: 200px;
    z-index: 1;
`

const StyledSecurityIcon = styled(SecurityIcon)`
    width: 16px;
    height: 16px;
`

const StyledTooltip = styled(Tooltip)`
    line-height: 16px;
`

const Header = styled.div`
    width: 100%;
    position: fixed;
    height: 200px;
    border-bottom: 1px solid #EFEFEF;
    background-color: #FDFDFD;
    left: 0;
    top: 0;
    padding: 65px 24px 16px 24px;

    @media (min-width: ${MD}px) {
        padding-left: 40px;
    }

    @media (min-width: ${LG}px) {
        padding-left: 104px;
    }
`

const StreamName = styled.span``

const Title = styled.div`
    font-family: var(--sans);
    font-weight: var(--regular);
    font-size: 18px;
    line-height: 30px;
    color: #323232;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: ${MD}px) {
        ${StreamName} {
            display: none;
        }
    }
`

const TitleSkeleton = styled(Skeleton)`
    height: 18px;

    @media (min-width: ${MD}px) {
        width: 75%;
    }
`

const Description = styled.div`
    font-size: 12px;
    color: #A3A3A3;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const DescriptionSkeleton = styled(Skeleton)`
    height: 12px;
    width: 75%;

    @media (min-width: ${MD}px) {
        width: 50%;
    }
`

const Buttons = styled.div`
    position: fixed;
    right: 32px;
    top: 150px;

    button + button {
        margin-left: 16px;
    }

    @media (max-width: ${LG}px) {
        button:first-child {
            display: none;
        }
    }
`

const StyledButton = styled(Button)`
    && {
        font-size: 12px;
        height: 32px;
        min-width: 80px;
    }

    @media (min-width: ${MD}px) {
        && {
            min-width: 125px;
        }
    }
`

const SelectorRoot = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #525252;

    @media (min-width: ${MD}px) {
        min-width: 224px;
    }
`

const SelectorTitle = styled.div`
    font-weight: var(--medium);
    line-height: 24px;
    min-width: 70px;

    @media (min-width: ${LG})px {
        flex: 1;
        min-width: 85px;
    }
`

const SelectorIcon = styled(IconButton)`
    svg {
        width: 8px;
        height: 14px;
        position: absolute;

        ${({ back }) => !!back && css`
            transform: translate(-60%, -50%);
        `}
        ${({ forward }) => !!forward && css`
            transform: translate(-40%, -50%);
        `}
    }
`

const SelectorPages = styled.div`
    min-width: 64px;
    text-align: center;
    padding: 0 0.5rem;

    strong {
        font-weight: var(--medium);
    }
`

const MobileText = styled.span`
    @media (min-width: ${MD}px) {
        display: none;
    }
`

const TabletText = styled.span`
    display: none;

    @media (min-width: ${MD}px) {
        display: inline-block;
    }
`

const StreamData = styled.div`
    position: fixed;
    left: 0;
    top: 257px;
    bottom: 0;
    width: calc(100% - 130px);
    overflow-y: scroll;
    transition:opacity 300ms linear;
    margin-bottom: 80px;

    ${({ inspectorFocused }) => (inspectorFocused ? css`
        opacity: 0;
    ` : `
        opacity: 1;
    `)}

    @media (min-width: ${MD}px) {
        width: calc(100% - 504px);
        margin-bottom: 0;
    }
`

const Inspector = styled.div`
    position: fixed;
    right: 0;
    top: 257px;
    bottom: 0;
    background-color: #FAFAFA;
    border-left: 1px solid #EFEFEF;
    width: 504px;
    transition: left 300ms ease-out;

    @media (max-width: ${MD}px) {
        left: calc(100% - 130px);
        right: auto;
        width: 100%;

        ${({ inspectorFocused }) => !!inspectorFocused && css`
            left: 0;
            transform: none;
        `}
    }
`

const HeaderItem = styled.div`
    line-height: 56px;
    padding: 0 24px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: var(--medium);
`

const Columns = styled.div`
    position: fixed;
    top: 200px;
    width: 100%;
    border-bottom: 1px solid #EFEFEF;
    height: 57px;
`

const TimestampHeader = styled(HeaderItem)`
    position: fixed;
    top: 200px;
    left: 0;

    @media (min-width: ${MD}px) {
        left: 16px;
    }

    @media (min-width: ${LG}px) {
        left: 80px;
    }
`
const DataHeader = styled(HeaderItem)`
    position: fixed;
    top: 200px;
    left: 256px;

    @media (max-width: ${LG}px) {
        display: none;
    }

    @media (min-width: ${LG}px) {
        left: 336px;
    }
`

const InspectorHeader = styled(HeaderItem)`
    position: fixed;
    top: 200px;
    right: 0;
    width: 504px;
    background-color: #FAFAFA;
    border-left: 1px solid #EFEFEF;
    padding: 0 32px 0 40px;
    transition: left 300ms ease-out;

    @media (max-width: ${MD}px) {
        left: calc(100% - 130px);
        right: auto;
        padding: 0 24px;
        width: 100%;

        ${({ inspectorFocused }) => !!inspectorFocused && css`
            left: 0;
            transform: none;
        `}
    }
`

const TableItem = styled.div`
    line-height: 56px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const TableRow = styled.div`
    border-bottom: 1px solid #EFEFEF;
    display: grid;
    grid-template-columns: 1fr;
`

const DataTable = styled.div`
    @media (min-width: ${LG}px) {
        margin: 0 80px;
    }

    ${TableItem} {
        padding: 0 24px;
    }

    ${TableRow} {
        cursor: pointer;

        &:hover {
            background-color: #FAFAFA;
        }

        &:last-child {
            border-bottom: 0;
        }

        @media (max-width: ${LG}px) {
            ${TableItem}:last-child {
                display: none;
            }
        }

        @media (min-width: ${MD}px) {
            ${TableItem} {
                padding-left: 40px;
            }
        }

        @media (min-width: ${LG}px) {
            grid-template-columns: 256px 1fr;

            ${TableItem} {
                padding-left: 24px;
            }
        }
    }
`

const InspectorTable = styled.div`
    @media (min-width: ${MD}px) {
        margin: 0 32px 0 40px;
    }

    ${TableRow} {
        ${TableItem}:first-child {
            color: #A3A3A3;
            text-transform: uppercase;
        }

        @media (max-width: ${LG}px) {
            ${TableItem}:last-child {
                display: block;
            }
        }

        @media (max-width: ${MD}px) {
            ${TableItem} {
                padding: 0 24px;
            }

            grid-template-columns: 130px 1fr;
        }

        grid-template-columns: 164px 1fr;
    }
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

    @media (min-width: ${MD}px) {
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

const Selector = ({
    title,
    options,
    active,
    onChange: onChangeProp,
    ...rest
}) => {
    const current = useMemo(() => {
        if (!options || options.length <= 0) {
            return undefined
        }

        return options.indexOf(active)
    }, [active, options])

    const onChange = useCallback((target) => {
        const nextIndex = Math.max(0, Math.min(target, options.length))

        onChangeProp(options[nextIndex])
    }, [options, onChangeProp])

    if (!options || options.length <= 0) {
        return null
    }

    return (
        <SelectorRoot {...rest}>
            <SelectorTitle>{title}</SelectorTitle>
            <SelectorIcon
                back
                disabled={current <= 0}
                onClick={() => onChange(current - 1)}
            >
                <SvgIcon name="back" />
            </SelectorIcon>
            <SelectorPages>
                <strong>{current + 1}</strong> of <strong>{options.length}</strong>
            </SelectorPages>
            <SelectorIcon
                forward
                disabled={current >= options.length - 1}
                onClick={() => onChange(current + 1)}
            >
                <SvgIcon name="forward" />
            </SelectorIcon>
        </SelectorRoot>
    )
}

const StreamSelector = styled(Selector)`
    position: fixed;
    left: 24px;
    top: 150px;

    @media (min-width: ${MD}px) {
        left: 40px;
    }

    @media (min-width: ${LG}px) {
        left: 104px;
    }
`

const PartitionSelector = styled(Selector)`
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 1;

    @media (min-width: ${MD}px) {
        left: calc(100% - 504px);
        top: 150px;
        bottom: auto;
        right: auto;
    }

    @media (min-width: ${LG}px) {
        left: 360px;
        top: 150px;
        bottom: auto;
        right: auto;
    }
`

const streamData = Array(20).fill({
    timestamp: '2020-01-21 14:31:34.166',
    data: {
        NO2: 14,
        CO2: 405,
        PM: 2.5,
        temp: 18.5,
        pressure: 1029.1,
    },
})

const StreamPreview = ({
    streamId,
    stream,
    navigableStreamIds,
    onChange,
    titlePrefix,
}) => {
    const [inspectorFocused, setInspectorFocused] = useState(false)
    const { copy, isCopied } = useCopy()

    const streamLoaded = !!(stream && stream.id === streamId)
    const { name, description } = stream || {}

    return (
        <Container>
            <CloseButton>
                <SvgIcon name="crossMedium" />
            </CloseButton>
            <Header>
                {!streamLoaded && (
                    <React.Fragment>
                        <Title>
                            <TitleSkeleton />
                        </Title>
                        <Description>
                            <DescriptionSkeleton />
                        </Description>
                    </React.Fragment>
                )}
                {!!streamLoaded && (
                    <React.Fragment>
                        <Title title={name}>
                            {!!titlePrefix && (
                                <StreamName>{titlePrefix} &rarr; </StreamName>
                            )}
                            {name}
                        </Title>
                        <Description title={description}>{description}</Description>
                    </React.Fragment>
                )}
            </Header>
            <StyledLoadingIndicator loading={!streamLoaded} />
            {!!navigableStreamIds && navigableStreamIds.length > 0 && (
                <StreamSelector
                    title="Streams"
                    options={navigableStreamIds}
                    active={streamId}
                    onChange={onChange}
                />
            )}
            {!!streamLoaded && (
                <PartitionSelector title="Partitions" length={146} current={112} />
            )}
            <Buttons>
                <StyledButton
                    kind="secondary"
                >
                    Stream Settings
                </StyledButton>
                <StyledButton
                    kind="secondary"
                    onClick={() => copy(streamId)}
                >
                    {!!isCopied && (
                        <React.Fragment>Copied!</React.Fragment>
                    )}
                    {!isCopied && (
                        <React.Fragment>
                            <MobileText>Copy Id</MobileText>
                            <TabletText>Copy Stream ID</TabletText>
                        </React.Fragment>
                    )}
                </StyledButton>
            </Buttons>
            <Columns>
                <TimestampHeader>Timestamp</TimestampHeader>
                <DataHeader>Data</DataHeader>
                <InspectorHeader inspectorFocused={inspectorFocused}>Inspector</InspectorHeader>
            </Columns>
            <StreamData inspectorFocused={inspectorFocused}>
                {!!streamLoaded && (
                    <DataTable>
                        {streamData.map(({ timestamp, data }, index) => (
                            /* eslint-disable-next-line react/no-array-index-key */
                            <TableRow key={index}>
                                <TableItem>{timestamp}</TableItem>
                                <TableItem>
                                    {JSON.stringify(data)}
                                </TableItem>
                            </TableRow>
                        ))}
                    </DataTable>
                )}
            </StreamData>
            <Inspector inspectorFocused={inspectorFocused}>
                {!!streamLoaded && (
                    <InspectorTable>
                        <TableRow>
                            <TableItem>Security</TableItem>
                            <TableItem>
                                <StyledTooltip value={getSecurityLevelTitle(stream)} placement="top">
                                    <StyledSecurityIcon
                                        level={getSecurityLevel(stream)}
                                        mode="small"
                                    />
                                </StyledTooltip>
                            </TableItem>
                        </TableRow>
                        <TableRow>
                            <TableItem>Timestamp</TableItem>
                            <TableItem>{streamData[0].timestamp}</TableItem>
                        </TableRow>
                        {Object.keys(streamData[0].data).map((key) => (
                            <TableRow key={key}>
                                <TableItem>{key}</TableItem>
                                <TableItem>
                                    {JSON.stringify(streamData[0].data[key])}
                                </TableItem>
                            </TableRow>
                        ))}
                    </InspectorTable>
                )}
            </Inspector>
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

export default StreamPreview
