import SearchIcon from '@atlaskit/icon/glyph/search'
import { useQuery } from '@tanstack/react-query'
import React, { InputHTMLAttributes, useRef, useState } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'
import {
    SimpleDropdownMenu as PrestyledSimpleDropdownMenu,
    SimpleDropdown,
    SimpleListDropdownMenu,
} from '~/components/SimpleDropdown'
import Spinner from '~/components/Spinner'
import { OrderDirection, Stream_OrderBy } from '~/generated/gql/network'
import { FieldWrap, IconWrapAppendix, TextInput } from '~/modals/FormModal'
import { getPagedStreams } from '~/services/streams'
import { useWalletAccount } from '~/shared/stores/wallet'
import { parseStreamId, truncate } from '~/shared/utils/text'
import { useCurrentChainId } from '~/utils/chains'
import { DropdownMenuItem } from './DropdownMenuItem'

interface Props
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'value' | 'defaultValue' | 'type'
    > {
    onChange?: (value: string) => void
    value?: string
}

export function StreamIdDropdown({
    disabled = false,
    readOnly,
    onBlur: onBlurProp,
    onChange,
    onFocus: onFocusProp,
    onKeyDown: onKeyDownProp,
    value = '',
    ...props
}: Props) {
    const wallet = useWalletAccount()

    const currentChainId = useCurrentChainId()

    const inputRef = useRef<HTMLInputElement>(null)

    const listRef = useRef<HTMLUListElement>(null)

    const [queryValue] = useDebounce(value, 250)

    const { data: streamIds = [], isLoading } = useQuery({
        queryKey: ['StreamIdDropdown.streamIds', currentChainId, queryValue],
        queryFn: async () => {
            try {
                return (
                    await getPagedStreams(
                        currentChainId,
                        20,
                        undefined,
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
                            <Spinner color="blue" />
                        </SpinnerWrap>
                    ) : streamIds.length ? (
                        <ul ref={listRef}>
                            {streamIds.map((streamId, index) => {
                                const shortStreamId = (() => {
                                    try {
                                        const { owner, pathname } =
                                            parseStreamId(streamId)

                                        return `${truncate(owner)}${pathname}`
                                    } catch (_) {}

                                    return streamId
                                })()

                                return (
                                    <DropdownMenuItem
                                        key={streamId}
                                        highlight={!index && inputFocused}
                                        highlightOnFocus
                                        type="button"
                                        onClick={() => {
                                            onChange?.(streamId)

                                            toggle(false)

                                            inputRef.current?.focus()
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') {
                                                e.stopPropagation()

                                                inputRef.current?.focus()

                                                toggle(false)
                                            }

                                            if (e.key === 'Backspace') {
                                                e.preventDefault()

                                                inputRef.current?.focus()
                                            }
                                        }}
                                        onKeyDownToNextButton={(e, button) => {
                                            if (button) {
                                                button.focus()

                                                e.preventDefault()
                                            }
                                        }}
                                        onKeyDownToPrevButton={(_, button) => {
                                            if (button) {
                                                return void button.focus()
                                            }

                                            inputRef.current?.focus()
                                        }}
                                    >
                                        {shortStreamId}
                                    </DropdownMenuItem>
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
                            readOnly={readOnly}
                            ref={inputRef}
                            onMouseDown={() => {
                                if (readOnly) {
                                    return
                                }

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
                                if (readOnly) {
                                    return
                                }

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
