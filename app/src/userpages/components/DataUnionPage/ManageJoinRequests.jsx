// @flow

import React, { useState, useCallback } from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import { MEDIUM } from '$shared/utils/styled'
import { ago } from '$shared/utils/time'
import { truncate } from '$shared/utils/text'
import useJoinRequests from '$mp/modules/dataUnion/hooks/useJoinRequests'

const Container = styled.div`
    background: #FDFDFD;
    border: 1px solid #EFEFEF;
    border-radius: 4px;
    display: grid;
    grid-template-rows: 72px auto 72px;
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
    grid-template-columns: 1fr 1fr 80px;
`

const Table = styled.div`
    overflow: auto;
`

const TableHeader = styled(TableGrid)`
    font-weight: ${MEDIUM};
    height: 56px;
    font-size: 12px;
    line-height: 16px;
    color: #A3A3A3;
    border-bottom: 1px solid #EFEFEF;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #FDFDFD;
`

const TableRows = styled.div`
    height: ${({ rowCount }) => (rowCount * 56)}px;
`

const TableRow = styled(TableGrid)`
    font-size: 14px;
    line-height: 56px;
    color: #525252;

    > * {
        opacity: ${({ processing }) => (processing ? 0.5 : 1.0)};
    }

    &:not(:last-child),
    &:only-child {
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

const NoJoinRequests = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 14px;
    line-height: 18px;
`

const Approving = styled.div`
    font-size: 12px;
`

type Props = {
    dataUnion: any,
    joinRequests: Array<any>,
    className?: string,
}

const ManageJoinRequests = ({ dataUnion, joinRequests, className }: Props) => {
    const [processingRequests, setProcessingRequests] = useState([])
    const { approve } = useJoinRequests()
    const dataUnionId = dataUnion && dataUnion.id

    const approveSingle = useCallback(async (id) => {
        setProcessingRequests((prev) => [
            ...prev,
            id,
        ])
        try {
            await approve({
                dataUnionId,
                joinRequestId: id,
            })
        } finally {
            setProcessingRequests((prev) => prev.filter((req) => req.id !== id))
        }
    }, [approve, dataUnionId])

    const approveAll = useCallback(async () => {
        // TODO: This would be better done in parallel
        // but the backend seems to choke this way so
        // do sequentially for now.

        // eslint-disable-next-line no-restricted-syntax
        for (const req of joinRequests) {
            // eslint-disable-next-line no-await-in-loop
            await approveSingle(req.id)
        }
    }, [approveSingle, joinRequests])

    return (
        <Container className={className}>
            <Heading>Manage join requests</Heading>
            <Table>
                <TableHeader>
                    <span>Address</span>
                    <span>Requested</span>
                </TableHeader>
                <TableRows rowCount={3}>
                    {joinRequests.map((req) => {
                        const processing = processingRequests.includes(req.id)
                        return (
                            <TableRow key={req.id} processing={processing}>
                                <span>{truncate(req.memberAddress)}</span>
                                <span>{ago(new Date(req.dateCreated))}</span>
                                {processing ? (
                                    <Approving>Approving...</Approving>
                                ) : (
                                    <ApproveButton onClick={() => approveSingle(req.id)}>
                                        Approve
                                    </ApproveButton>
                                )}
                            </TableRow>
                        )
                    })}
                    {joinRequests.length === 0 && (
                        <NoJoinRequests>No join requests waiting for you</NoJoinRequests>
                    )}
                </TableRows>
            </Table>
            <Footer>
                <Button
                    kind="primary"
                    size="normal"
                    outline
                    onClick={() => approveAll()}
                    disabled={joinRequests.length === 0}
                >
                    Approve all requests
                </Button>
            </Footer>
        </Container>
    )
}

export default styled(ManageJoinRequests)``
