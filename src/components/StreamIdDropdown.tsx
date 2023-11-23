import { useQuery } from '@tanstack/react-query'
import React, { InputHTMLAttributes, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useDebounce } from 'use-debounce'
import SearchIcon from '@atlaskit/icon/glyph/search'
import {
    SimpleDropdown,
    SimpleDropdownMenu as PrestyledSimpleDropdownMenu,
    SimpleListDropdownMenu as PrestyledSimpleListDropdownMenu,
} from '~/components/SimpleDropdown'
import { OrderDirection, Stream_OrderBy } from '~/generated/gql/network'
import { FieldWrap, IconWrapAppendix, TextInput } from '~/modals/FormModal'
import { getPagedStreams } from '~/services/streams'
import Spinner from '~/shared/components/Spinner'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS } from '~/shared/utils/styled'
import { parseStreamId, truncate } from '~/shared/utils/text'

interface Props
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'value' | 'defaultValue' | 'type'
    > {
    onChange?: (value: string) => void
    value?: string
}

function withNextButton(el: HTMLElement, fn: (button: HTMLButtonElement | null) => void) {
    fn(
        el.parentElement?.nextElementSibling?.querySelector(
            'button',
        ) as HTMLButtonElement | null,
    )
}

function withPrevButton(el: HTMLElement, fn: (button: HTMLButtonElement | null) => void) {
    fn(
        el.parentElement?.previousElementSibling?.querySelector(
            'button',
        ) as HTMLButtonElement | null,
    )
}

export function StreamIdDropdown({
    disabled = false,
    onBlur: onBlurProp,
    onChange,
    onFocus: onFocusProp,
    onKeyDown: onKeyDownProp,
    value = '',
    ...props
}: Props) {
    const wallet = useWalletAccount()

    const inputRef = useRef<HTMLInputElement>(null)

    const listRef = useRef<HTMLUListElement>(null)

    const [queryValue] = useDebounce(value, 250)

    const { data: streamIds = [], isLoading } = useQuery({
        queryKey: ['StreamIdDropdown.streamIds', queryValue],
        async queryFn({ pageParam }) {
            try {
                return (
                    await getPagedStreams(
                        20,
                        pageParam,
                        undefined,
                        queryValue,
                        Stream_OrderBy.Id,
                        OrderDirection.Asc,
                        { force: true },
                    )
                ).streams.map(({ id }) => id)
            } catch (e) {
                console.warn('Failed to load streams', queryValue, e)
            }
        },
    })

    const [inputFocused, setInputFocused] = useState(false)

    return (
        <SimpleDropdown
            disabled={disabled}
            menuWrapComponent={StreamDropdownMenuWrap}
            menu={(toggle) => (
                <SimpleListDropdownMenu>
                    {isLoading ? (
                        <SpinnerWrap>
                            <Spinner color="blue" size="small" />
                        </SpinnerWrap>
                    ) : streamIds.length ? (
                        <ul ref={listRef}>
                            {streamIds.map((streamId, index) => {
                                const shortStreamId = (() => {
                                    try {
                                        const { owner, pathname } =
                                            parseStreamId(streamId)

                                        return `${truncate(owner)}${pathname}`
                                    } catch (e) {}

                                    return streamId
                                })()

                                return (
                                    <li key={streamId}>
                                        <Item
                                            $highlight={!index && inputFocused}
                                            type="button"
                                            onClick={() => {
                                                onChange?.(streamId)

                                                toggle(false)

                                                inputRef.current?.focus()
                                            }}
                                            onKeyDown={(e) => {
                                                switch (e.key) {
                                                    case 'Escape':
                                                        e.stopPropagation()

                                                        inputRef.current?.focus()

                                                        toggle(false)

                                                        return

                                                    case 'ArrowDown':
                                                        return void withNextButton(
                                                            e.currentTarget,
                                                            (button) => {
                                                                if (button) {
                                                                    button.focus()

                                                                    e.preventDefault()
                                                                }
                                                            },
                                                        )

                                                    case 'ArrowUp':
                                                        e.preventDefault()

                                                        return void withPrevButton(
                                                            e.currentTarget,
                                                            (button) => {
                                                                if (button) {
                                                                    return void button.focus()
                                                                }

                                                                inputRef.current?.focus()
                                                            },
                                                        )

                                                    case 'Backspace':
                                                        e.preventDefault()

                                                        inputRef.current?.focus()

                                                        return

                                                    default:
                                                }
                                            }}
                                        >
                                            <div>{shortStreamId}</div>
                                            <div>
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <rect
                                                        width="20"
                                                        height="20"
                                                        rx="2"
                                                        fill={COLORS.secondaryHover}
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        // eslint-disable-next-line max-len
                                                        d="M5.92578 10.9012C5.92578 10.7812 5.97346 10.6661 6.05834 10.5812C6.14321 10.4964 6.25832 10.4487 6.37835 10.4487H11.8092C12.1693 10.4487 12.5146 10.3056 12.7692 10.051C13.0238 9.79639 13.1669 9.45106 13.1669 9.09097V7.28069C13.1669 7.16067 13.2146 7.04555 13.2994 6.96068C13.3843 6.87581 13.4994 6.82812 13.6195 6.82812C13.7395 6.82812 13.8546 6.87581 13.9395 6.96068C14.0243 7.04555 14.072 7.16067 14.072 7.28069V9.09097C14.072 9.69111 13.8336 10.2667 13.4092 10.691C12.9849 11.1154 12.4093 11.3538 11.8092 11.3538H6.37835C6.25832 11.3538 6.14321 11.3061 6.05834 11.2213C5.97346 11.1364 5.92578 11.0213 5.92578 10.9012Z"
                                                        fill="black"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        // eslint-disable-next-line max-len
                                                        d="M6.05829 11.2218C5.97344 11.1369 5.92578 11.0218 5.92578 10.9018C5.92578 10.7818 5.97344 10.6667 6.05829 10.5818L7.86856 8.77157C7.95392 8.68913 8.06824 8.64352 8.1869 8.64455C8.30556 8.64558 8.41907 8.69318 8.50298 8.77709C8.58689 8.861 8.63449 8.97451 8.63552 9.09317C8.63655 9.21183 8.59093 9.32615 8.50849 9.4115L7.01819 10.9018L8.50849 12.3921C8.55172 12.4339 8.5862 12.4838 8.60992 12.539C8.63364 12.5942 8.64612 12.6536 8.64664 12.7137C8.64716 12.7738 8.63571 12.8334 8.61296 12.889C8.5902 12.9446 8.5566 12.9952 8.5141 13.0377C8.47161 13.0802 8.42108 13.1138 8.36546 13.1365C8.30984 13.1593 8.25025 13.1707 8.19016 13.1702C8.13007 13.1697 8.07068 13.1572 8.01546 13.1335C7.96025 13.1098 7.91031 13.0753 7.86856 13.0321L6.05829 11.2218Z"
                                                        fill="black"
                                                    />
                                                </svg>
                                            </div>
                                        </Item>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <Zero>
                            0 matches for <strong>{queryValue}</strong>
                        </Zero>
                    )}
                </SimpleListDropdownMenu>
            )}
        >
            {(toggle, isOpen) => {
                return (
                    <FieldWrap>
                        <TextInput
                            {...props}
                            disabled={disabled}
                            ref={inputRef}
                            onMouseDown={() => {
                                toggle((c) => !c)
                            }}
                            value={value}
                            onChange={(e) => {
                                onChange?.(e.target.value)

                                toggle(true)
                            }}
                            onFocus={(e) => {
                                onFocusProp?.(e)

                                setInputFocused(true)
                            }}
                            onBlur={(e) => {
                                onBlurProp?.(e)

                                setInputFocused(false)
                            }}
                            onKeyDown={(e) => {
                                onKeyDownProp?.(e)

                                switch (e.key) {
                                    case 'Enter':
                                        if (isOpen && streamIds[0]) {
                                            e.preventDefault()

                                            onChange?.(streamIds[0])

                                            toggle(false)
                                        }

                                        return
                                    case 'Escape':
                                        if (isOpen) {
                                            toggle(false)

                                            return void e.stopPropagation()
                                        }

                                        if (value.length) {
                                            onChange?.('')

                                            return void e.stopPropagation()
                                        }

                                        return

                                    case 'ArrowUp':
                                        e.preventDefault()

                                        return void toggle(false)

                                    case 'ArrowDown':
                                        e.preventDefault()

                                        if (!isOpen) {
                                            return void toggle(true)
                                        }

                                        listRef.current?.querySelector('button')?.focus()

                                        return

                                    case 'ArrowRight':
                                        if (!value.length && wallet) {
                                            onChange?.(`${wallet.toLowerCase()}/`)

                                            toggle(true)
                                        }

                                        return

                                    case 'Backspace':
                                        if (!value) {
                                            toggle(false)
                                        }

                                        return

                                    default:
                                }
                            }}
                        />
                        <IconWrapAppendix>
                            <SearchIcon label="Search" />
                        </IconWrapAppendix>
                    </FieldWrap>
                )
            }}
        </SimpleDropdown>
    )
}

const StreamDropdownMenuWrap = styled(PrestyledSimpleDropdownMenu)<{
    $vibible?: boolean
}>`
    width: 100%;
`

const SimpleListDropdownMenu = styled(PrestyledSimpleListDropdownMenu)`
    padding: 8px 0;
`

const Item = styled.button<{ $highlight?: boolean }>`
    align-items: center;
    appearance: none;
    background: none;
    border: 0;
    display: flex;
    font-size: 14px;
    padding: 8px 24px;
    text-align: left;
    white-space: nowrap;
    width: 100%;
    transition: 250ms background-color;

    :focus,
    :hover {
        background: ${COLORS.secondary};
        transition-duration: 50ms;
    }

    :focus > div:last-child {
        opacity: 1;
    }

    > div:first-child {
        flex-grow: 1;
    }

    > div:last-child {
        opacity: 0;
        transition: 100ms opacity;
    }

    svg {
        display: block;
        border-radius: 4px;
    }

    ${({ $highlight = false }) =>
        $highlight &&
        css`
            > div:last-child {
                opacity: 1;
            }
        `}
`

const SpinnerWrap = styled.div`
    align-items: center;
    display: flex;
    height: 40px;
    justify-content: center;
    width: 100%;
`

const Zero = styled.p`
    font-size: 14px;
    overflow: hidden;
    padding: 8px 24px;
    text-overflow: ellipsis;
    white-space: nowrap;
`
