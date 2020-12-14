// @flow

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { type Ref } from '$shared/flowtype/common-types'
import debounce from 'lodash/debounce'
import styled, { css } from 'styled-components'

import SvgIcon from '$shared/components/SvgIcon'
import useIsMounted from '$shared/hooks/useIsMounted'

type Props = {
    onChange?: ?(string) => void,
    placeholder?: ?string,
    value: ?string,
}

const CursorHolder = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: none;
    cursor: default;
    height: calc(2 * var(--um));
    width: calc(2 * var(--um));
`

const CloseButtonWrapper = styled.div`
    flex-shrink: 0;
    height: calc(0.625 * var(--um));
    margin-left: calc(0.4375 * var(--um));
    opacity: 0;
    overflow: visible;
    visibility: hidden;
    transition: 300ms;
    transition-property: visibility, opacity;
    transition-delay: 300ms, 0s;
    width: calc(0.625 * var(--um));
`

const CloseButton = styled.button`
    background-color: transparent;
    border: 0;
    display: block;
    height: calc(1.5 * var(--um));
    outline: 0;
    padding: calc(0.4375 * var(--um));
    transform: translate(calc(-0.4375 * var(--um)), calc(-0.4375 * var(--um)));
    width: calc(1.5 * var(--um));
    appearance: none;

    svg {
        color: #A3A3A3;
        display: block;
    }
`

const Inner = styled.div`
    flex-grow: 1;
    position: relative;
    width: 100%;

    svg {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: #A3A3A3;
        height: var(--um);
        pointer-events: none;
        width: var(--um);
        transition: 100ms color;
    }
`

const Root = styled.div`
    align-items: center;
    cursor: default;
    display: flex;
    position: relative;
    transition: 300ms width;
    width: var(--um);

    ::after {
        bottom: 0;
        content: '';
        display: block;
        height: 2px;
        left: 0;
        position: absolute;
        transition: 300ms background-color;
        width: 100%;
    }

    input {
        border: 0;
        cursor: pointer;
        display: block;
        height: 2em;
        line-height: 2em;
        min-width: var(--um);
        outline: 0;
        padding: 0 0 0 calc(2 * var(--um));
        transform: translateY(-2px);
        width: 100%;
    }

    input::placeholder {
        color: transparent;
        transition: 300ms linear color;
    }

    ${({ open }) => !!open && css`
        ::after {
            background-color: #FF5C00;
        }

        input {
            cursor: text;
        }

        input::placeholder {
            color: #A3A3A3;
        }

        cursor: text;
        width: calc(12 * var(--um));

        ${Inner} svg {
            color: #FF5C00;
        }

        ${CursorHolder} {
            display: block;
        }

        ${CloseButtonWrapper} {
            opacity: 1;
            transition-delay: 0s, 0s;
            visibility: visible;
        }
    `}
`

const InputWrapper = styled.div`
    overflow: hidden;
    width: 100%;
`

export const Active = ({ value: valueProp, onChange: onChangeProp, placeholder }: Props) => {
    const isMounted = useIsMounted()

    const [value, setValue] = useState(valueProp || '')

    const [focused, setFocused] = useState(false)

    const open = !!(focused || value)

    useEffect(() => {
        setValue(valueProp || '')
    }, [valueProp])

    const onFocus = useCallback(() => {
        setFocused(true)
    }, [])

    const onBlur = useCallback(() => {
        setFocused(false)
    }, [])

    const defineDebouncedOnChange = useCallback((onChange: ?(string) => void) => (
        debounce((value: string) => {
            if (isMounted() && onChange) {
                onChange(value)
            }
        }, 500)
    ), [isMounted])

    const debouncedOnChangeRef: Ref<Function> = useRef(defineDebouncedOnChange(onChangeProp))

    useEffect(() => {
        const { current: debouncedOnChange } = debouncedOnChangeRef

        // We have to cancel all pending `debouncedOnChange` every time `onChangeProp` changes.
        if (debouncedOnChange) {
            debouncedOnChange.cancel()
        }

        debouncedOnChangeRef.current = defineDebouncedOnChange(onChangeProp)
    }, [onChangeProp, defineDebouncedOnChange])

    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        const { value } = e.target
        setValue(value)
        const { current: debouncedOnChange } = debouncedOnChangeRef

        if (debouncedOnChange) {
            debouncedOnChange(value)
        }
    }, [])

    const inputRef: Ref<HTMLInputElement> = useRef(null)

    const reset = useCallback(() => {
        const { current: input } = inputRef

        if (value !== '') {
            setValue('')

            if (onChangeProp) {
                onChangeProp('')
            }
        }

        if (input) {
            input.blur()
        }
    }, [value, onChangeProp])

    return (
        <Root open={open}>
            <Inner>
                <InputWrapper>
                    <input
                        onBlur={onBlur}
                        onChange={onChange}
                        onFocus={onFocus}
                        placeholder={placeholder}
                        ref={inputRef}
                        type="text"
                        value={value}
                    />
                </InputWrapper>
                <SvgIcon name="search" />
                <CursorHolder />
            </Inner>
            <CloseButtonWrapper>
                <CloseButton
                    type="button"
                    onClick={reset}
                    tabIndex="-1"
                >
                    <SvgIcon name="crossMedium" />
                </CloseButton>
            </CloseButtonWrapper>
        </Root>
    )
}

const SearchPlaceholder = styled.div`
    width: var(--um);
    cursor: not-allowed;

    svg {
        opacity: 0.3;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: #A3A3A3;
        pointer-events: none;
        height: var(--um);
        width: var(--um);
    }
`

export const Disabled = () => (
    <SearchPlaceholder>
        <SvgIcon name="search" />
    </SearchPlaceholder>
)

export default {
    Active,
    Disabled,
}
