import React, { useMemo } from 'react'
import { Translate } from 'react-redux-i18n'
import styled, { css } from 'styled-components'

import SvgIcon from '$shared/components/SvgIcon'
import { SM, LG } from '$shared/utils/styled'
import Segment from '$shared/components/Segment'

const StreamCount = styled.span`
    display: inline-block;
    line-height: 24px;
    padding: 0 12px;
    font-weight: var(--medium);
    background-color: #D8D8D8;
    border-radius: 4px;
    margin-left: 16px;
`

const LockedNotice = styled.span`
    margin-left: 16px;
    line-height: 24px;
    font-weight: var(--regular);
    display: none;
    letter-spacing: 0;
    text-transform: none;

    ${Segment}:hover &,
    ${Segment}:focus-within & {
        display: inline-block;
    }
`

const TableBody = styled.div`
    max-height: 279px;
    overflow: auto;
`

const RowItem = styled.div`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const RowButtons = styled.div`
    height: 32px;

    button {
        color: #ADADAD;
        background-color: inherit;
        width: 32px;
        height: 32px;
        padding: 0;
        margin: 0;
        border: none;
        apearance: none;
        background: none;
        border-radius: 4px;
        position: relative;

        svg {
            width: 16px;
            height: 16px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        &:hover,
        &:focus {
            background-color: #EFEFEF;
            color: #525252;
            outline: none;
        }

        &:active {
            background-color: #D8D8D8;
        }
    }

    button + button {
        margin-left: 16px;
    }
`

const DataRow = styled.div`
    position: relative;
    height: 56px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 24px;
    white-space: nowrap;

    @media (min-width: ${SM}px) {
        padding: 0 32px;
    }
    
    ${Segment.Header} & {
        padding: 0;
    }

    &:not(:last-child) {
        border-bottom: 1px solid #EFEFEF;
    }

    * + * {
        margin-left: 24px;
    }

    ${RowItem} {
        color: ${({ locked }) => (locked ? '#ADADAD' : 'inherit')};
    }

    ${RowButtons} {
        display: none;
    }

    ${({ clickable }) => !!clickable && css`
        @media (max-width: ${LG}px) {
            &:active,
            &:focus-within {
                background-color: #F3F3F3;
            }
        }
    `}

    @media (min-width: ${LG}px) {
        &:hover,
        &:focus-within {
            ${RowButtons} {
                display: block;
            }
        }
    }
`

const TitleItem = styled(RowItem)`
    flex: 1;

    @media (min-width: ${SM}px) {
        width: 228px;
        flex: initial;
    }

    @media (min-width: ${LG}px) {
        width: 328px;
        flex: initial;
    }
`

const DescriptionItem = styled(RowItem)`
    display: none;

    @media (min-width: ${SM}px) {
        display: block;
        flex: 1;
    }
`

const MobileHitTarget = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;

    @media (min-width: ${LG}px) {
        display: none;
    }
`

const HeaderRow = styled(DataRow)`
    ${RowItem} {
        font-weight: var(--medium);
    }

    ${RowButtons} {
        display: none;
    }
`

export const StreamListing = ({
    streams: streamsProp,
    locked,
    fetchingStreams,
    onStreamPreview,
    onStreamSettings,
    ...props
}) => {
    const streams = useMemo(() => streamsProp || [], [streamsProp])

    const showPreview = useMemo(() => !!(
        !locked && !!onStreamPreview && typeof onStreamPreview === 'function'
    ), [locked, onStreamPreview])

    const showSettings = useMemo(() => !!(
        !locked && !!onStreamSettings && typeof onStreamSettings === 'function'
    ), [locked, onStreamSettings])

    return (
        <Segment {...props}>
            <Segment.Header>
                <HeaderRow>
                    <TitleItem>
                        <Translate value="productPage.streamListing.streams" />
                        {!fetchingStreams && (
                            <StreamCount>{streams.length}</StreamCount>
                        )}
                        {!!locked && (
                            <LockedNotice>
                                <Translate value="productPage.streamListing.subscribe" />
                            </LockedNotice>
                        )}
                    </TitleItem>
                    <DescriptionItem>
                        <Translate value="productPage.streamListing.description" />
                    </DescriptionItem>
                </HeaderRow>
            </Segment.Header>
            <Segment.Body>
                {!fetchingStreams && (
                    <TableBody>
                        {streams.map(({ id: streamId, description }) => (
                            <DataRow key={streamId} locked={locked} clickable={!locked && !!showPreview}>
                                <TitleItem title={description}>{streamId}</TitleItem>
                                <DescriptionItem title={description}>{description}</DescriptionItem>
                                {(!!showPreview || !!showSettings) && (
                                    <RowButtons>
                                        {!!showPreview && (
                                            <button type="button" onClick={() => onStreamPreview(streamId)}>
                                                <SvgIcon name="listInspect" />
                                            </button>
                                        )}
                                        {!!showSettings && (
                                            <button type="button" onClick={() => onStreamSettings(streamId)}>
                                                <SvgIcon name="listSettings" />
                                            </button>
                                        )}
                                    </RowButtons>
                                )}
                                {!!showPreview && (
                                    <MobileHitTarget onClick={() => onStreamPreview(streamId)} />
                                )}
                            </DataRow>
                        ))}
                    </TableBody>
                )}
                {!!fetchingStreams && (
                    <DataRow locked={locked}>
                        <RowItem>
                            <Translate value="productPage.streamListing.loading" />
                        </RowItem>
                    </DataRow>
                )}
                {!fetchingStreams && streams.length === 0 && (
                    <DataRow locked={locked}>
                        <RowItem>
                            <Translate value="productPage.streamListing.noStreams" />
                        </RowItem>
                    </DataRow>
                )}
            </Segment.Body>
        </Segment>
    )
}

export default StreamListing
