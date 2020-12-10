// @flow

import React, { useMemo, useCallback, useState } from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import { MEDIUM } from '$shared/utils/styled'
import { ago } from '$shared/utils/time'

const Container = styled.div`
    background: #FDFDFD;
    border: 1px solid #EFEFEF;
    border-radius: 4px;
    display: grid;
    grid-template-rows: 72px 56px auto 72px;
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
    grid-template-columns: 1fr 1fr auto;
`

const TableHeader = styled(TableGrid)`
    font-weight: ${MEDIUM};
    font-size: 12px;
    line-height: 16px;
    color: #A3A3A3;
    border-bottom: 1px solid #EFEFEF;
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
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid #EFEFEF;

    > * {
        margin-right: 16px;
    }
`

const ApproveButton = styled(Button).attrs(() => ({
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

const JoinRequests = () => {
    const requests = [
        {
            address: '0x23213',
            timestamp: Date.now(),
        },
        {
            address: '0x23213',
            timestamp: Date.now(),
        },
        {
            address: '0x23213',
            timestamp: Date.now(),
        },
        {
            address: '0x23213',
            timestamp: Date.now(),
        },
        {
            address: '0x23213',
            timestamp: Date.now(),
        },
    ]
    return (
        <Container>
            <Heading>Manage join requests</Heading>
            <TableHeader>
                <span>Address</span>
                <span>Requested</span>
                {/* Render button to make 'auto' column work properly */}
                <ApproveButton>Approve</ApproveButton>
            </TableHeader>
            <TableRows rowCount={3}>
                {requests.map((req) => (
                    <TableRow>
                        <span>{req.address}</span>
                        <span>{ago(new Date(req.timestamp))}</span>
                        <ApproveButton>Approve</ApproveButton>
                    </TableRow>
                ))}
            </TableRows>
            <Footer>
                <Button kind="primary" size="normal" outline>
                    Approve all requests
                </Button>
            </Footer>
        </Container>
    )
}

export default JoinRequests
