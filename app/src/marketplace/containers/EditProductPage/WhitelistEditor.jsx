// @flow

import React, { useState } from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import Toggle from '$shared/components/Toggle'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'

const Container = styled.div`
    background: #fdfdfd;
    border-radius: 4px;
    border: 1px solid #ebebeb;
    font-size: 14px;
`

const TableRow = styled.span`
    display: grid;
    grid-template-columns: 1fr 1fr 96px 96px;
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
        return 'red'
    }};

    
    width: 16px;
    height: 16px;
`

const Label = styled.label`
    margin-bottom: 0;
`

type Props = {
    className?: string,
}

const WhitelistEditor = ({ className }: Props) => {
    const [isEnabled, setIsEnabled] = useState(true)

    const items = [
        {
            name: 'Test 1',
            address: '0x123123213231',
            status: 'asd',
        },
        {
            name: 'Test 2',
            address: '0x123123213231',
            status: 'asd 2',
        },
        {
            name: 'Test 1',
            address: '0x123123213231',
            status: 'asd',
        },
        {
            name: 'Test 2',
            address: '0x123123213231',
            status: 'asd 2',
        },
    ]

    return (
        <Container className={className}>
            <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Ethereum address</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader />
            </TableRow>
            {items.map((item) => (
                <TableRow>
                    <TableColumn disabled={!isEnabled}><span>{item.name}</span></TableColumn>
                    <TableColumn disabled={!isEnabled}><span>{item.address}</span></TableColumn>
                    <TableColumn disabled={!isEnabled} center><Status disabled={!isEnabled} /></TableColumn>
                    <TableColumn disabled={!isEnabled} center>
                        <StyledDropdownActions
                            title={<Meatball alt="Select" />}
                            noCaret
                            disabled={!isEnabled}
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
                    value={isEnabled}
                    onChange={(val) => { setIsEnabled(val) }}
                />
                <Button
                    kind="secondary"
                    size="normal"
                    disabled={!isEnabled}
                >
                    Add to Whitelist
                </Button>
            </Controls>
        </Container>
    )
}

export default WhitelistEditor
