// @flow

import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import { MEDIUM } from '$shared/utils/styled'
import { ago } from '$shared/utils/time'
import { truncate } from '$shared/utils/text'
import UnstyledLoadingIndicator from '$shared/components/LoadingIndicator'
import useJoinRequests from '$mp/modules/dataUnion/hooks/useJoinRequests'
import useDataUnionMembers from '$mp/modules/dataUnion/hooks/useDataUnionMembers'
import useIsMounted from '$shared/hooks/useIsMounted'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useAllDataUnionStats from '$mp/modules/dataUnion/hooks/useAllDataUnionStats'

const Container = styled.div`
    background: #FDFDFD;
    border: 1px solid #EFEFEF;
    border-radius: 4px;
    display: grid;
    grid-template-rows: 72px auto 72px;
`

const LoadingIndicator = styled(UnstyledLoadingIndicator)`
    position: sticky !important;
    top: 58px;
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
    &:nth-child(-n+3) { /* -n+3 means the 3 first children  */
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
    chainId: number,
    joinRequests: Array<any>,
    className?: string,
}

const ManageJoinRequests = ({ dataUnion, joinRequests, className }: Props) => {
    const isMounted = useIsMounted()
    const [processingRequests, setProcessingRequests] = useState([])
    const [approveAllProcessing, setApproveAllProcessing] = useState(false)
    const loading = approveAllProcessing || processingRequests.length > 0
    const { approve } = useJoinRequests()
    const { load: loadMembers } = useDataUnionMembers()
    const { loadByDataUnionId: loadDataUnionStats } = useAllDataUnionStats()
    const dataUnionId = dataUnion && dataUnion.id

    const pendingRequests = useMemo(() => (
        joinRequests.filter((req) => req.state === 'PENDING')
    ), [joinRequests])

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
        } catch (e) {
            Notification.push({
                title: `Approve failed: ${e.message}`,
                icon: NotificationIcon.ERROR,
            })
        } finally {
            if (isMounted()) {
                setProcessingRequests((prev) => prev.filter((req) => req !== id))

                // Refresh member listing
                await loadMembers(dataUnionId)
                loadDataUnionStats([dataUnionId])
            }
        }
    }, [approve, dataUnionId, loadMembers, isMounted, loadDataUnionStats])

    const approveAll = useCallback(async () => {
        setApproveAllProcessing(true)
        // TODO: This would be better done in parallel
        // but the backend seems to choke this way so
        // do this sequentially for now.

        // eslint-disable-next-line no-restricted-syntax
        for (const req of pendingRequests) {
            // eslint-disable-next-line no-await-in-loop
            await approveSingle(req.id)
        }

        if (isMounted()) {
            setApproveAllProcessing(false)
        }
    }, [approveSingle, pendingRequests, isMounted])

    return (
        <Container className={className}>
            <Heading>Manage join requests</Heading>
            <Table>
                <TableHeader>
                    <span>Address</span>
                    <span>Requested</span>
                </TableHeader>
                <LoadingIndicator loading={loading} />
                <TableRows rowCount={3}>
                    {pendingRequests.map((req) => {
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
                    {pendingRequests.length === 0 && (
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
                    disabled={pendingRequests.length === 0}
                    waiting={approveAllProcessing}
                >
                    Approve all requests
                </Button>
            </Footer>
        </Container>
    )
}

export default styled(ManageJoinRequests)``
