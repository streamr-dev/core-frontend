import React, { useMemo } from 'react'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import SvgIcon from '$shared/components/SvgIcon'
import { MD, LG } from '$shared/utils/styled'
import ProductContainer from '$shared/components/Container/Product'

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
    display: inline-block;
    line-height: 24px;
    font-weight: var(--regular);
    display: none;
`

const Root = styled.div`
    background: var(--greyLight3);
    border-radius: 2px;
    border: 1px solid #EFEFEF;

    &:hover,
    &:focus-within {
        ${LockedNotice} {
            display: inline-block;
        }
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
    height: 56px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 32px;
    white-space: nowrap;
    
    &:not(:last-child) {
        border-bottom: 1px solid #EFEFEF;
    }

    * + * {
        margin-left: 24px;
    }

    ${RowItem} {
        font-size: 14px;
        color: ${({ locked }) => (locked ? '#ADADAD' : 'inherit')};
    }

    ${RowButtons} {
        display: none;
    }

    &:hover,
    &:focus-within {
        ${RowButtons} {
            display: block;
        }
    }
`

const TitleItem = styled(RowItem)`
    flex: 1;

    @media (min-width: ${LG}px) {
        width: 328px;
        flex: initial;
    }
`

const DescriptionItem = styled(RowItem)`
    display: none;

    @media (min-width: ${LG}px) {
        display: block;
        flex: 1;
    }
`

const HeaderRow = styled(DataRow)`
    height: 72px;
    background-color: #EFEFEF;
    color: #323232;

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
    className,
}) => {
    const streams = useMemo(() => streamsProp || [], [streamsProp])

    const showPreview = useMemo(() => !!(
        !locked && !!onStreamPreview && typeof onStreamPreview === 'function'
    ), [locked, onStreamPreview])
    const showSettings = useMemo(() => !!(
        !locked && !!onStreamSettings && typeof onStreamSettings === 'function'
    ), [locked, onStreamSettings])

    return (
        <Root className={className}>
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
            {!fetchingStreams && (
                <TableBody>
                    {streams.map(({ id: streamId, name, description }) => (
                        <DataRow key={streamId} locked={locked}>
                            <TitleItem title={name}>{name}</TitleItem>
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
        </Root>
    )
}

const StyledProductContainer = styled(ProductContainer)`
    && {
        margin-top: 4em;

        @media (max-width: ${MD}px) {
            padding-left: 0;
            padding-right: 0;

            ${Root} {
                border-left: 0;
                border-right: 0;
                border-radius: 0;
            }
        }
    }
`

export default (props) => (
    <StyledProductContainer>
        <StreamListing {...props} />
    </StyledProductContainer>
)
