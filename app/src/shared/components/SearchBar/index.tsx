import React, {
    ChangeEvent,
    FunctionComponent,
    MouseEventHandler,
    useEffect,
    useMemo,
    useState,
} from 'react'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'
import { COLORS, SM, MD } from '$shared/utils/styled'
import searchIcon from './SearchIcon.svg'
import closeIcon from './CloseIcon.svg'

type SearchBarProps = {
    onChange?: (searchValue: string) => void
    debounceTime?: number
    placeholder?: string
    value?: string
    autoFocus?: boolean
}

const SearchBar: FunctionComponent<SearchBarProps> = ({
    onChange,
    value,
    debounceTime = 250,
    placeholder = 'Search',
    autoFocus = false,
}) => {
    const [focused, setFocused] = useState<boolean>()
    const [inputValue, setInputValue] = useState<string>('')

    useEffect(() => {
        if (value != null) {
            setInputValue(value)
        }
    }, [value])

    const debouncedChangeHandler = useDebouncedCallback((searchValue: string) => {
        if (typeof onChange === 'function') {
            return onChange(searchValue)
        }
    }, debounceTime)

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setInputValue(event.target.value)
        debouncedChangeHandler(event.target.value)
    }

    const clearSearch: MouseEventHandler<HTMLButtonElement> = (event): void => {
        event.preventDefault()
        setInputValue('')
        if (typeof onChange === 'function') {
            onChange('')
        }
    }

    return (
        <FormWrapper onSubmit={(event) => event.preventDefault()}>
            <SearchIcon src={searchIcon} className={focused ? 'hidden' : ''} />
            <SearchInput
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={handleChange}
                value={inputValue}
                autoFocus={autoFocus}
            />
            <ClearButton
                onClick={clearSearch}
                className={!inputValue ? 'hidden' : ''}
                type="button"
            >
                <img src={closeIcon} alt="Clear search" />
            </ClearButton>
        </FormWrapper>
    )
}

const transitionTime = 150

const FormWrapper = styled.form`
    display: flex;
    width: 100%;
    background-color: ${COLORS.secondary};
    border-radius: 200px;
    position: relative;
`

const SearchInput = styled.input`
    background-color: transparent;
    border: none;
    border-radius: 200px;
    width: 100%;
    line-height: 40px;
    height: 40px;
    font-size: 14px;
    padding: 0 20px 0 45px;
    color: ${COLORS.primary};
    outline: 2px solid transparent;
    transition: all ${transitionTime}ms ease-in;

    :focus {
        outline-color: ${COLORS.focus};
        padding-left: 20px;
    }

    ::placeholder {
        color: ${COLORS.primaryLight};
        opacity: 1;
    }

    ::selection {
        background-color: ${COLORS.selection};
        opacity: 1;
        color: ${COLORS.primary};
    }

    @media (min-width: ${SM}px) {
        line-height: 50px;
        height: 50px;
    }

    @media (min-width: ${MD}px) {
        line-height: 60px;
        height: 60px;
    }
`

const SearchIcon = styled.img`
    position: absolute;
    width: 16px;
    top: 12px;
    left: 20px;
    transition: opacity ${transitionTime}ms ease-in, left 1ms linear;
    opacity: 1;

    &.hidden {
        transition: opacity ${transitionTime}ms ease-in,
            left 1ms linear ${transitionTime}ms;
        opacity: 0;
        left: 0;
    }

    @media (min-width: ${SM}px) {
        top: 17px;
    }

    @media (min-width: ${MD}px) {
        top: 22px;
    }
`

const ClearButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    width: 40px;
    height: 40px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: transparent;
    border-radius: 100%;
    transition: opacity ${transitionTime}ms ease-in,
        background-color ${transitionTime}ms ease-in;
    opacity: 1;

    &.hidden {
        opacity: 0;
    }

    :hover {
        background-color: ${COLORS.secondaryHover};
    }

    @media (min-width: ${SM}px) {
        width: 50px;
        height: 50px;
    }

    @media (min-width: ${MD}px) {
        width: 60px;
        height: 60px;
    }
`

export default SearchBar
