// @flow

import React, { useState } from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import { MEDIUM } from '$shared/utils/styled'

const Container = styled.div`
    background: #FDFDFD;
    border: 1px solid #EFEFEF;
    border-radius: 4px;
    display: grid;
    grid-template-rows: 72px 56px auto 16px;
`

const Row = styled.div`
    padding-left: 24px;
    align-items: center;
`

const Heading = styled(Row)`
    font-weight: ${MEDIUM};
    font-size: 14px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: #323232;
    border-bottom: 1px solid #EFEFEF;
`

const TableGrid = styled(Row)`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto auto;
`

const TableHeader = styled(TableGrid)`
    font-weight: ${MEDIUM};
    font-size: 12px;
    line-height: 16px;
    color: #A3A3A3;
    border-bottom: 1px solid #EFEFEF;

    &:nth-child(3) {
        justify-items: center;
    }
`

const TableRows = styled.div`
    height: ${({ rowCount }) => (rowCount * 56)}px;
    overflow: auto;
`

const TableRow = styled(TableGrid)`
    font-size: 14px;
    line-height: 56px;
    color: #525252;

    &:not(:last-child) {
        border-bottom: 1px solid #EFEFEF;
    }
`

const Footer = styled.div`
    border-top: 1px solid #EFEFEF;
`
const RemoveButton = styled(Button).attrs(() => ({
    kind: 'link',
    variant: 'dark',
}))`
    visibility: hidden;
    font-size: 12px !important;
    margin: 0 16px;

    ${TableRow}:hover & {
        visibility: visible;
    }
`

const Status = styled.div`
    border-radius: 100%;
    background: ${({ isActive }) => (isActive ? '#2AC437' : '#D90C25;')};
    height: 16px;
    width: 16px;
`

const ManageMembers = () => {
    console.log('Members')
    const members = [
        {
            address: '0xqweqwee',
            earnings: 123.5,
            withdrawable: 20.4,
            isActive: false,
        },
        {
            address: '0xqweqwee',
            earnings: 123.5,
            withdrawable: 20.4,
            isActive: true,
        },
        {
            address: '0xqweqwee',
            earnings: 123.5,
            withdrawable: 20.4,
            isActive: true,
        },
        {
            address: '0xqweqwee',
            earnings: 123.5,
            withdrawable: 20.4,
            isActive: false,
        },
        {
            address: '0xqweqwee',
            earnings: 123.5,
            withdrawable: 20.4,
            isActive: false,
        },
    ]
    return (
        <Container>
            <Heading>Manage members</Heading>
            <TableHeader>
                <span>Address</span>
                <span>Earnings</span>
                <span>Withdrawable</span>
                <span>Status</span>
                {/* Render button to make 'auto' column work properly */}
                <RemoveButton>Remove</RemoveButton>
            </TableHeader>
            <TableRows rowCount={4}>
                {members.map((member) => (
                    <TableRow>
                        <span>{member.address}</span>
                        <span>{member.earnings}</span>
                        <span>{member.withdrawable}</span>
                        <Status isActive={member.isActive} />
                        <RemoveButton>Remove</RemoveButton>
                    </TableRow>
                ))}
            </TableRows>
            <Footer />
        </Container>
    )
}

export default ManageMembers
