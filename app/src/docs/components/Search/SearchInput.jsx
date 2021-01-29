// @flow

import React, { useCallback, useState } from 'react'
import { I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import SvgIcon from '$shared/components/SvgIcon'
import UnstyledEditableText from '$shared/components/EditableText'
import UseState from '$shared/components/UseState'
import type { SearchFilter } from '$mp/flowtype/product-types'
import { SM, MD, LG } from '$shared/utils/styled'

type Props = {
    value: ?SearchFilter,
    onChange: (text: SearchFilter) => void,
    onClose?: () => void,
}

const Inner = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    padding: 0 calc(1.5rem - 4px) 0 1.5rem;

    @media (min-width: ${SM}px) {
        padding: 0 calc(1.5rem - 4px) 0 3rem;
    }

    @media (min-width: ${MD}px) {
        padding: 0 1.5rem 0 3rem;
    }

    @media (min-width: ${LG}px) {
        padding: 0 1.5rem;
    }
`

const SearchIcon = styled.div`
    min-width: 32px;
    height: 32px;
    line-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 16px;
        height: 16px;
    }
`

const EditableText = styled(UnstyledEditableText)`
    && {
        text-align: left;
        font-family: var(--sans);
        font-size: 16px;
        color: ${({ theme }) => (theme.editing ? 'var(--greyDark2)' : '#CDCDCD')};
        border: none;
        background: none;
        display: flex;
        height: 100%;
        font-style: normal;
        line-height: normal;
        cursor: initial;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    input {
        border: none;
        background: none;
        display: inline-block;
        height: 100%;
        text-align: left;
        width: 100%;

        &::placeholder {
            color: #CDCDCD;
            font-weight: var(--light);
            opacity: 1;
        }

        &:focus {
            outline: none;

            &::placeholder {
                color: transparent;
            }
        }
    }
`

const ButtonBase = styled.button`
    appearance: none;
    border: 0;
    background: transparent;
    margin: 0;
    padding: 8px;
    line-height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        color: #A3A3A3;
        width: 16px;
        height: 16px;
    }

    :focus {
        outline: none;
    }
`

const CloseButton = styled(ButtonBase)`
    min-width: 32px;
    height: 32px;
    white-space: nowrap;

    svg {
        width: 10px;
        height: 10px;
    }

    path {
        transition: all 0.1s;
        fill: var(--greyDark2);
        stroke: var(--greyDark2);
    }
`

const Separator = styled.div`
    width: 1px;
    height: 24px;
    border-left: 1px solid #CDCDCD;
    margin: 0 16px;
`

const ClearButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const ClearButton = styled(ButtonBase)`
    color: #A3A3A3;
    height: 32px;
    font-size: 14px;
    white-space: nowrap;

    :hover {
        color: var(--greyDark2);
    }
`

const UnstyledSearchInput = ({ value, onChange, onClose, ...props }: Props) => {
    // use the counter to re-render input in order to focus after clearing
    const [refreshCounter, setRefreshCounter] = useState(0)

    const onClear = useCallback(() => {
        onChange('')
        setRefreshCounter((counter) => counter + 1)
    }, [onChange])

    return (
        <div {...props}>
            <Inner>
                <SearchIcon>
                    <SvgIcon name="search" />
                </SearchIcon>
                <UseState initialValue={false} key={refreshCounter}>
                    {(editing, setEditing) => (
                        <EditableText
                            placeholder={I18n.t('docs.search.placeholder')}
                            value={value}
                            onChange={onChange}
                            editOnFocus
                            selectAllOnFocus={false}
                            commitEmpty
                            editing={editing}
                            setEditing={setEditing}
                            autoFocus
                            theme={{
                                editing,
                            }}
                        >
                            {value || ''}
                        </EditableText>
                    )}
                </UseState>
                {!!value && (
                    <ClearButtonWrapper>
                        <ClearButton
                            type="button"
                            onClick={() => onClear()}
                        >
                            {I18n.t('docs.search.clear')}
                        </ClearButton>
                        <Separator />
                    </ClearButtonWrapper>
                )}
                <CloseButton
                    type="button"
                    onClick={onClose}
                >
                    <SvgIcon name="crossMedium" />
                </CloseButton>
            </Inner>
        </div>
    )
}

UnstyledSearchInput.defaultProps = {
    value: '',
    onChange: () => {},
}

const SearchInput = styled(UnstyledSearchInput)`
    background: var(--greyLight3);
    color: #CDCDCD;
    height: 80px;
    font-size: 16px;
    text-align: center;
    height: 72px;

    ${Inner} {
        max-width: 1080px;
    }

    ${SearchIcon} {
        display: none;
    }

    ${EditableText} {
        flex-grow: 1;
        margin-right: 4px;

        @media (min-width: ${MD}px) {
            margin-right: 8px;
        }
    }

    @media (min-width: ${LG}px) {
        ${SearchIcon} {
            display: flex;
            margin-left: -8px;
        }

        height: 112px;
    }
`

export default SearchInput
