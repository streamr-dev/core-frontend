import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'

import { MD, LG } from '$shared/utils/styled'
import Checkbox from '$shared/components/Checkbox'

const List = styled.div`
    @media (min-width: ${MD}px) {
        margin-top: 50px;
        border-top: 1px solid #CDCDCD;
    }

    @media (min-width: ${LG}px) {
        margin-top: 0;
        margin-bottom: auto;
        border-top: none;
    }
`

const Item = styled.div`
    color: #323232;
    letter-spacing: 0;
    display: none;
    position: relative;
    white-space: nowrap;

    ${({ center }) => !!center && css`
        text-align: center;
    `}

    ${({ truncate }) => !!truncate && css`
        overflow-x: hidden;
        word-break: break-word;
        text-overflow: ellipsis;
    `}

    @media (min-width: ${LG}px) {
        font-size: 14px;
        display: block;
    }
`

const UnstyledActions = (props) => (
    <Item {...props} onClick={(event) => event.stopPropagation()} />
)

const Actions = styled(UnstyledActions)`
    visibility: hidden;
`

const Row = styled.div`
    display: grid;
    grid-row-gap: 2px;
    grid-column-gap: 1rem;
    border-bottom: 1px solid #CDCDCD;
    padding: 1.15rem 1.5rem;
    grid-template-columns: minmax(200px, 2fr);
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    align-items: center;
    line-height: 20px;
    color: #525252;
    min-height: 80px;

    &:hover,
    &:focus-within {
        background-color: #EFEFEF;

        ${Actions} {
            visibility: visible;
        }
    }

    @media (min-width: ${MD}px) {
        padding: 1.5rem;
    }

    @media (min-width: ${LG}px) {
        grid-row-gap: 0;
        padding: 1.25rem 0.75rem;
        min-height: auto;
    }
`

const Header = styled(Row)`
    display: none;
    cursor: inherit;

    &:hover,
    &:focus-within {
        background-color: inherit;
    }

    @media (min-width: ${LG}px) {
        display: grid;
        padding: 0.75rem;
        line-height: 14px;
    }
`

const HeaderItem = styled(Item)`
    && {
        font-family: var(--sans);
        font-size: 12px;
        letter-spacing: 0;
        color: #A3A3A3;
        font-weight: var(--medium);
    }
`

const TitleCell = styled(Item)`
    display: block;
    font-weight: var(--medium);

    @media (min-width: ${LG}px) {
        font-size: 14px;
    }
`

const TitleValueAndInfo = styled.div`
    display: flex;
    flex-direction: column;
    overflow-x: hidden;

    @media (min-width: ${MD}px) {
        flex-direction: row;
        align-items: baseline;
    }
`

const TitleValue = styled.div`
    overflow-x: hidden;
    word-break: break-word;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const TitleMoreInfo = styled.div`
    color: #A3A3A3;
    font-size: 12px;
    white-space: nowrap;
    font-weight: var(--regular);

    @media (min-width: ${MD}px) {
        margin-left: 1rem;
    }

    @media (min-width: ${LG}px) {
        display: none;
    }
`

const TitleDescription = styled.div`
    font-size: 12px;
    font-weight: var(--regular);
    overflow-x: hidden;
    word-break: break-word;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: none;

    @media (min-width: ${MD}px) {
        display: block;
    }

    @media (min-width: ${LG}px) {
        display: none;
    }
`

const Title = ({ description, moreInfo, children }) => (
    <TitleCell>
        <TitleValueAndInfo>
            <TitleValue title={children}>{children}</TitleValue>
            <TitleMoreInfo>{moreInfo}</TitleMoreInfo>
        </TitleValueAndInfo>
        <TitleDescription>{description}</TitleDescription>
    </TitleCell>
)

const CheckboxContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translate(0, -45%);

    @media (min-width: ${LG}px) {
        left: 0;
        transform: translate(-100%, -45%);
    }

    & > * {
        visibility: hidden;
    }
`

const SelectableRowWrapper = styled.div`
    position: relative;

    ${({ clickable }) => !!clickable && css`
        cursor: pointer;
    `}

    ${({ active }) => !!active && css`
        ${CheckboxContainer} > * {
            visibility: visible;
        }

        ${Row} {
            background-color: #EFEFEF;
        }
    `}

    @media (min-width: ${MD}px) {
        &:hover {
            ${CheckboxContainer} > * {
                visibility: visible;
            }

            ${Row} {
                background-color: #EFEFEF;

                ${Actions} {
                    visibility: visible;
                }
            }
        }
    }

    ${({ selectable }) => !!selectable && css`
        ${Row} {
            padding-left: 2.75rem;
        }

        @media (min-width: ${MD}px) {
            ${Row} {
                padding-left: 3.25rem;
            }
        }

        @media (min-width: ${LG}px) {
            ${Row} {
                padding-left: 0.75rem;
            }
        }
    `}
`

const SelectableRow = ({
    id,
    selectable,
    active,
    onClick: onClickProp,
    ...props
}) => {
    const onClick = useCallback(() => {
        if (onClickProp) {
            onClickProp(id)
        }
    }, [id, onClickProp])

    return (
        <SelectableRowWrapper
            onClick={onClick}
            active={active}
            selectable={!!selectable}
            clickable={!!onClickProp || !!selectable}
        >
            {!!selectable && (
                <CheckboxContainer>
                    <Checkbox
                        value={!!active}
                        onChange={() => {}}
                    />
                </CheckboxContainer>
            )}
            <Row {...props} />
        </SelectableRowWrapper>
    )
}

List.Row = SelectableRow
List.Title = Title
List.Header = Header
List.HeaderItem = HeaderItem
List.Item = Item
List.Actions = Actions

const StreamList = styled(List)`
    ${Item}:nth-child(5) {
        display: block;

        & > * {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    ${Row} {
        grid-template-columns: minmax(0, 1fr) 16px;

        @media (min-width: ${LG}px) {
            grid-template-columns:
                minmax(200px, 3fr)
                minmax(200px, 3fr)
                minmax(136px, 2fr)
                minmax(136px, 2fr)
                minmax(68px, 1fr)
                32px;
        }
    }
`

const MemberList = styled(List)`
    ${Item}:nth-child(4) {
        display: block;

        & > * {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    ${Row} {
        grid-template-columns: minmax(0, 1fr) 16px;

        @media (min-width: ${LG}px) {
            grid-template-columns:
                minmax(200px, 5fr)
                minmax(136px, 2fr)
                minmax(136px, 2fr)
                minmax(68px, 1fr);
        }
    }
`

const TransactionList = styled(List)`
    ${Item}:nth-child(7) {
        display: block;

        & > * {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    ${Row} {
        grid-template-columns: minmax(0, 1fr) 16px;

        @media (min-width: ${LG}px) {
            grid-template-columns:
                minmax(200px, 2fr)
                minmax(auto, 1fr)
                minmax(auto, 1fr)
                minmax(auto, 1fr)
                minmax(auto, 1fr)
                minmax(auto, 1fr)
                minmax(68px, 1fr)
                32px;
        }
    }
`

export {
    List,
    StreamList,
    MemberList,
    TransactionList,
}
