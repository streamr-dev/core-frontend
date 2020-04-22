// @flow

import React from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import Toggle from '$shared/components/Toggle'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import useWhitelist from './useWhitelist'

const Container = styled.div`
    background: #fdfdfd;
    border-radius: 4px;
    border: 1px solid #ebebeb;
    font-size: 14px;
`

const TableRow = styled.span`
    display: grid;
    grid-template-columns: 220px 280px 90px 90px;
`

const TableColumnBase = styled.span`
    display: flex;
    justify-content: ${(props) => (props.center ? 'center' : 'unset')};
    align-items: center;
    height: 56px;
    padding: 0 24px;

    * {
        opacity: ${(props) => (props.disabled ? '0.5' : '1.0')};
    }

    &:not(:last-child) {
        border-right: 1px solid #ebebeb;
    }
`

const TableHeader = styled(TableColumnBase)`
    font-weight: 500;
    letter-spacing: 0px;
`

const TableColumn = styled(TableColumnBase)`
    border-top: 1px solid #ebebeb;

    ${TableRow}:hover & {
        background-color: #f8f8f8;
    }
`

const StyledDropdownActions = styled(DropdownActions)`
    visibility: hidden;

    ${TableRow}:hover & {
        visibility: ${(props) => (props.disabled ? 'hidden' : 'visible')};
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

const StyledToggle = styled(Toggle)`
    display: flex;
    align-items: center;

    * {
        margin-bottom: 0;
    }
`

const Status = styled.span`
    border-radius: 50%;
    background-color: ${(props) => {
        if (props.disabled) {
            return '#cdcdcd'
        }
        if (props.status === 'added') {
            return 'blue'
        }
        if (props.status === 'removed') {
            return 'green'
        }
        if (props.status === 'subscribed') {
            return 'black'
        }
        return 'red'
    }};

    width: 16px;
    height: 16px;
`

const Label = styled.label`
    margin-bottom: 0;
`

type WhitelistStatus = 'added' | 'removed' | 'subscribed'

type WhitelistItem = {
    name: string,
    address: string,
    status: WhitelistStatus,
}

type Props = {
    className?: string,
    enabled: boolean,
    items: Array<WhitelistItem>,
    onEnableChanged: (boolean) => void,
}

export const WhitelistEditorComponent = ({ className, enabled, items, onEnableChanged }: Props) => (
    <Container className={className}>
        <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Ethereum address</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader />
        </TableRow>
        {items.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={index}>
                <TableColumn disabled={!enabled}><span>{item.name}</span></TableColumn>
                <TableColumn disabled={!enabled}><span>{item.address}</span></TableColumn>
                <TableColumn disabled={!enabled} center><Status status={item.status} disabled={!enabled} /></TableColumn>
                <TableColumn disabled={!enabled} center>
                    <StyledDropdownActions
                        title={<Meatball alt="Select" />}
                        noCaret
                        disabled={!enabled}
                    >
                        <DropdownActions.Item onClick={() => console.log('edit')}>
                            Edit name
                        </DropdownActions.Item>
                        <DropdownActions.Item onClick={() => console.log('copy')}>
                            Copy address
                        </DropdownActions.Item>
                        <DropdownActions.Item onClick={() => console.log('remove')}>
                            Remove
                        </DropdownActions.Item>
                    </StyledDropdownActions>
                </TableColumn>
            </TableRow>
        ))}
        <Controls>
            <Label htmlFor="whitelist">Enable whitelist</Label>
            <StyledToggle
                id="whitelist"
                value={enabled}
                onChange={(val) => {
                    onEnableChanged(val)
                }}
            />
            <Button
                kind="secondary"
                size="normal"
                disabled={!enabled}
            >
                Add to Whitelist
            </Button>
        </Controls>
    </Container>
)

export const WhitelistEditor = () => {
    const { isEnabled, setEnabled, items } = useWhitelist()

    // TODO: Email address must be provided when we enable whitelist

    return (
        <WhitelistEditorComponent
            items={items}
            enabled={isEnabled}
            onEnableChanged={(value) => setEnabled(value)}
        />
    )
}

export default WhitelistEditor
