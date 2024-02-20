import React from 'react'
import styled, { css } from 'styled-components'
import { Tick } from '~/shared/components/Checkbox'
import Spinner from '~/components/Spinner'
import { StreamDraft } from '~/stores/streamDraft'

type Props = {
    address: string
    className?: string
    disabled: boolean
    children: React.ReactNode
}

function UnstyledStorageNodeItem({
    address,
    className,
    disabled = false,
    children,
}: Props) {
    const active = !!StreamDraft.useEntity({ hot: true })?.storage[address]

    const busy = false

    const update = StreamDraft.useUpdateEntity()

    return (
        <Root
            className={className}
            onClick={() => {
                update((hot, cold) => {
                    if (cold.storage[address] == null) {
                        cold.storage[address] = false
                    }

                    const enabled = !hot.storage[address]

                    hot.storage[address] = enabled

                    if (!enabled && !Object.values(hot.storage).some(Boolean)) {
                        /**
                         * If there are no other enabled storage nodes
                         * revert the storage days.
                         */
                        hot.metadata.storageDays = cold.metadata.storageDays
                    }
                })
            }}
            type="button"
            $active={active}
            disabled={disabled}
        >
            <div>{children}</div>
            {!disabled && (
                <Tick
                    $checked={active}
                    data-test-hook={active ? 'Checkbox on' : 'Checkbox off'}
                />
            )}
            {busy && <Spinner color="gray" />}
        </Root>
    )
}

const StorageNodeItem = styled(UnstyledStorageNodeItem)`
    align-items: center;
    appearance: none;
    background: #ffffff;
    border: 1px solid #efefef;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    font-size: 16px;
    height: 40px;
    line-height: normal;
    padding: 0 16px;
    text-align: left;
    transition: color 0.1s;
    width: 100%;

    :disabled,
    &[disabled] {
        background: #efefef;
        border-color: #efefef;
    }

    :focus {
        outline: 0;
    }

    & + & {
        margin-top: 16px;
    }

    > div:first-child {
        flex-grow: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    ${Tick} {
        flex-shrink: 0;
        margin-left: 12px;
    }
`
const Root = styled.button<{ $active: boolean }>`
    color: #cdcdcd;
    cursor: pointer;

    :disabled,
    &[disabled] {
        cursor: not-allowed;
    }

    ${({ $active }) =>
        !!$active &&
        css`
            color: #323232;
        `}

    ${({ $active }) =>
        typeof $active === 'undefined' &&
        css`
            cursor: default !important;
        `}
`
export default StorageNodeItem
