import React, { useCallback, useReducer } from 'react'
import styled from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import UnstyledEditableText from '$shared/components/EditableText'
import SearchBar from '$shared/components/SearchBar'
import UseState from '$shared/components/UseState'
import { SM, MD, LG } from '$shared/utils/styled'
import { SearchFilter } from '$mp/types/project-types'
type Props = {
    value: SearchFilter | null | undefined
    onChange: (text: SearchFilter) => void
    onClose?: () => void
}
const SearchInputWrapper = styled.div`
    position: relative;
    flex: 1;
`
const Inner = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    width: 100%;
    height: auto;
    padding: 20px calc(1.5rem - 4px) 0 1.5rem;

    @media (min-width: ${SM}px) {
        max-width: 540px;
    }

    @media (min-width: ${MD}px) {
        //padding: 0 3rem;
        max-width: 708px;
    }

    @media (min-width: ${LG}px) {
        padding: 0 1.5rem;

        max-width: 100%;
        display: grid;
        grid-template-columns: 1fr 770px 1fr;
        grid-column-gap: 2rem;

        ${SearchInputWrapper} {
            grid-column-start: 2;
        }
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
        position: relative;
        text-align: left;
        font-family: var(--sans);
        font-size: 14px;
        color: ${({ theme }) => (theme.editing ? 'var(--greyDark2)' : '#a3a3a3')};
        border: ${({ theme }) => (theme.editing ? '2px solid #9BC1FB' : 'none')};
        background: #f5f5f5;
        display: flex;
        height: 40px;
        padding: 8px 50px 8px 20px;
        border-radius: 20px;
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
            color: #cdcdcd;
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

    @media (min-width: ${LG}px) {
        && {
            height: 60px;
            border-radius: 30px;
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
        color: #a3a3a3;
        width: 16px;
        height: 16px;
    }

    :focus {
        outline: none;
    }
`
const CloseButton = styled(ButtonBase)`
    white-space: nowrap;
    margin-left: 7px;
    color: var(--greyDark2);
    transition: color .3s ease-in-out;

    :hover {
        color: var(--greyDark);
    }

    @media (min-width: ${LG}px) {
        margin-left: auto;
        margin-right: 1rem;
    }
`
const ClearButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1010;

    @media (min-width: ${LG}px) {
        right: 20px;
    }
`
const ClearButton = styled(ButtonBase)`
    background-color: var(--greyDark2);
    width: 16px;
    height: 16px;
    padding: 0;
    border-radius: 100%;
    transition: background-color .3s ease-in-out;

    svg {
        width: 7px;
        height: 7px;
    }

    path {
        transition: all 0.1s;
        fill: var(--grey4);
        stroke: var(--grey4);
    }

    :hover {
        background-color: var(--greyDark);
    }

    @media (min-width: ${LG}px) {
        width: 24px;
        height: 24px;

        svg {
            width: 10px;
            height: 10px;
        }
    }
`

const UnstyledSearchInput = ({ value, onChange, onClose, ...props }: Props) => {
    // use the counter to re-render input in order to focus after clearing
    const [refreshCounter, incrementRefreshCounter] = useReducer((x) => x + 1, 0)
    const onClear = useCallback(() => {
        onChange('')
        incrementRefreshCounter()
    }, [onChange])
    return (
        <div {...props}>
            <Inner>
                <SearchInputWrapper>
                    <SearchBar value={value} onChange={onChange} autoFocus />
                </SearchInputWrapper>
                <CloseButton type="button" onClick={onClose}>
                    Cancel
                </CloseButton>
            </Inner>
        </div>
    )
}

const SearchInput = styled(UnstyledSearchInput)`
    background: #ffffff;
    color: var(--greyDark2);
    font-size: 14px;
    text-align: center;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    ${SearchIcon} {
        display: none;
    }

    ${EditableText} {
        flex-grow: 1;
    }

    @media (min-width: ${LG}px) {
        position: relative;
        top: auto;
        left: auto;
        height: auto;
        padding: 40px 0 3rem;
        border-bottom: 1px solid #e7e7e7;
    }
`
export default SearchInput
