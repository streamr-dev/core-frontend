// @flow

import React, { useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import { StatusIcon } from '@streamr/streamr-layout'

import Button from '$shared/components/Button'
import UnstyledToggle from '$shared/components/Toggle'
import UnstyledPopover from '$shared/components/Popover'
import useCopy from '$shared/hooks/useCopy'
import type { WhitelistItem } from '$mp/modules/contractProduct/types'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import type { Address } from '$shared/flowtype/web3-types'

const MIN_ROWS = 5

const Rows = styled.div`
    max-height: ${({ theme }) => (((theme.rowCount + 1) * 56) - 1)}px; /* +1 for header, -1 for bottom border */
    overflow: auto;
    position: relative;
`

const Popover = styled(UnstyledPopover)`
    visibility: hidden;
`

const TableColumn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 24px;
    color: rgba(82, 82, 82);

    &:not(:last-child) {
        border-right: 1px solid #ebebeb;
    }
`

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 90px 90px;
    height: 56px;
    background: #FDFDFD;

    :hover {
        background-color: #F8F8F8;

        ${Popover} {
            visibility: visible;
        }
    }

    &:not(:last-child) {
        border-bottom: 1px solid #ebebeb;
    }

    > *:first-child {
        justify-content: unset;
    }

    ${({ theme }) => !!theme.disabled && css`
        ${TableColumn} {
            color: rgba(82, 82, 82, 0.5);
        }

        ${Popover} {
            visibility: hidden;
        }

        :hover {
            background-color: inherit;
        }
    `}

    ${({ theme }) => !!theme.menuOpen && css`
        ${Popover} {
            visibility: visible;
        }
    `}
`

const TableHeaderRow = styled(TableRow)`
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: white;

    ${TableColumn} {
        font-weight: 500;
        letter-spacing: 0px;
    }

    :hover {
        background-color: white;
    }
`

const Controls = styled.div`
    height: 72px;
    padding: 0 16px 0 24px;
    border-top: 1px solid #ebebeb;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-column-gap: 16px;
    align-items: center;
`

const Toggle = styled(UnstyledToggle)`
    display: flex;
    align-items: center;

    * {
        margin-bottom: 0;
    }
`

const Label = styled.label`
    margin-bottom: 0;
`

type CommonProps = {
    enabled: boolean,
    onRemove: (Address) => Promise<void>,
    actionsEnabled: boolean,
}

type EditorProps = CommonProps & {
    items: Array<WhitelistItem>,
    onEnableChanged: (boolean) => void,
    onAdd: () => Promise<void>,
}

type RowProps = CommonProps & {
    item: WhitelistItem,
}

const padWithEmptyRows = (rows: Array<WhitelistItem>) => {
    if (rows.length < MIN_ROWS) {
        return [...Array(MIN_ROWS - rows.length)].map((_, index) => (
            <TableRow
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                theme={{
                    disabled: true,
                }}
            >
                <TableColumn />
                <TableColumn />
                <TableColumn />
            </TableRow>
        ))
    }

    return null
}

const statusIconTheme = (disabled, status) => {
    if (disabled) {
        return StatusIcon.INACTIVE
    } else if (status === 'added') {
        return StatusIcon.PENDING
    } else if (status === 'removed') {
        return StatusIcon.REMOVED
    }
    return StatusIcon.OK
}

const statuses = {
    subscribed: 'Subscribed',
    added: 'Whitelisted',
    removed: 'Removed',
}

const TableRowItem = ({ item, enabled, actionsEnabled, onRemove }: RowProps) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const disabled = !enabled || item.isPending

    const { copy } = useCopy()

    const onCopy = useCallback((address: string) => {
        copy(address)

        Notification.push({
            title: 'Copied',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    return (
        <TableRow
            theme={{
                disabled,
                menuOpen,
            }}
        >
            <TableColumn>
                <span>{item.address}</span>
            </TableColumn>
            <TableColumn>
                <StatusIcon
                    status={statusIconTheme(disabled, item.status)}
                    tooltip={!disabled && statuses[item.status]}
                />
            </TableColumn>
            <TableColumn>
                <Popover
                    title="Select"
                    type="meatball"
                    caret={false}
                    onMenuToggle={setMenuOpen}
                >
                    <Popover.Item onClick={() => onCopy(item.address)}>
                        Copy address
                    </Popover.Item>
                    {item.status !== 'removed' && !!actionsEnabled && !disabled && (
                        <Popover.Item onClick={() => onRemove(item.address)}>
                            Remove
                        </Popover.Item>
                    )}
                </Popover>
            </TableColumn>
        </TableRow>
    )
}

export const UnstyledWhitelistEditor = ({
    enabled,
    items,
    onEnableChanged,
    onAdd,
    onRemove,
    actionsEnabled,
    ...props
}: EditorProps) => (
    <div {...props}>
        <Rows theme={{
            rowCount: MIN_ROWS,
        }}
        >
            <TableHeaderRow>
                <TableColumn>Ethereum Address</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn />
            </TableHeaderRow>
            {items.map((item) => (
                <TableRowItem
                    key={item.address}
                    item={item}
                    enabled={enabled}
                    actionsEnabled={actionsEnabled}
                    onRemove={onRemove}
                />
            ))}
            {padWithEmptyRows(items)}
        </Rows>
        <Controls>
            <Label htmlFor="whitelist">Enable whitelist</Label>
            <Toggle
                id="whitelist"
                value={enabled}
                onChange={onEnableChanged}
            />
            <Button
                kind="secondary"
                size="normal"
                disabled={!enabled || !actionsEnabled}
                onClick={() => onAdd()}
            >
                Add to whitelist
            </Button>
        </Controls>
    </div>
)

const WhitelistEditor = styled(UnstyledWhitelistEditor)`
    background: #fdfdfd;
    border-radius: 4px;
    border: 1px solid #ebebeb;
    font-size: 14px;
`

export default WhitelistEditor
