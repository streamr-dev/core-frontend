import React, { FunctionComponent, useEffect, useState } from 'react'
import SearchIcon from '@atlaskit/icon/glyph/search'
import Autocomplete from 'react-autocomplete'
import styled, { css } from 'styled-components'
import { FieldWrap, IconWrapAppendix, TextInput } from '~/components/TextInput'
import Spinner from '~/shared/components/Spinner'
import { useDebouncedCallback } from 'use-debounce'
import { COLORS } from '~/shared/utils/styled'

export const SearchDropdown: FunctionComponent<{
    options: { label: string; value: string }[]
    name: string
    value?: string
    placeholder?: string
    autoFocus?: boolean
    readOnly?: boolean
    onSelect: (selection: string) => void
    onSearchInputChange: (searchInputValue: string) => void
    isLoadingOptions?: boolean
    searchDebounceTime?: number
}> = ({
    options,
    value,
    isLoadingOptions,
    onSelect,
    onSearchInputChange,
    searchDebounceTime = 250,
    ...inputProps
}) => {
    const [inputValue, setInputValue] = useState(value)

    const debouncedSearchChangeHandler = useDebouncedCallback((searchValue: string) => {
        if (typeof onSearchInputChange === 'function') {
            return onSearchInputChange(searchValue)
        }
    }, searchDebounceTime)

    useEffect(() => {
        setInputValue(value)
    }, [value, setInputValue])

    return (
        <Autocomplete
            renderInput={(props: any) => (
                <FieldWrap>
                    <TextInput {...props} />
                    <IconWrapAppendix>
                        <SearchIcon label="Search" />
                    </IconWrapAppendix>
                </FieldWrap>
            )}
            wrapperStyle={{
                display: 'block',
                position: 'relative',
            }}
            items={options}
            inputProps={{ ...inputProps, value: inputValue, type: 'text' }}
            value={inputValue}
            getItemValue={(item) => item.value}
            onSelect={(itemValue) => onSelect(itemValue)}
            onChange={(event) => {
                setInputValue(event.target.value)
                debouncedSearchChangeHandler(event.target.value)
            }}
            renderItem={(item, isHighlighted, styles) => (
                <li key={item.value} className="option-element">
                    {item.label}
                </li>
            )}
            renderMenu={(items, value, styles) => {
                return (
                    <div>
                        {options.length || isLoadingOptions ? (
                            <Menu>
                                {isLoadingOptions ? (
                                    <SpinnerContainer>
                                        <Spinner size="large" color="blue" />
                                    </SpinnerContainer>
                                ) : (
                                    <ul className="options-list">{items}</ul>
                                )}
                            </Menu>
                        ) : (
                            <div></div>
                        )}
                    </div>
                )
            }}
        />
    )
}

const Menu = styled.div`
    position: absolute;
    top: 50px;
    z-index: 20;
    background-color: white;
    width: 100%;
    box-shadow: 0px 0px 1px 0px rgba(9, 30, 66, 0.31),
        0px 3px 5px 0px rgba(9, 30, 66, 0.2);
    border-radius: 8px;
    padding: 8px 0px;
    max-height: 600px;
    overflow: auto;

    .options-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: transparent;
    }
    .option-element {
        padding: 6px 16px;
        margin: 0;
        font-weight: 400;
        font-size: 14px;
        color: ${COLORS.primaryLight};
        cursor: pointer;

        &:hover {
            background-color: ${COLORS.separator};
        }
    }
`

const SpinnerContainer = styled.div`
    display: flex;
    padding: 20px;
    justify-content: center;
    align-items: center;
`
