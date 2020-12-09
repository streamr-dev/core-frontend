// @flow

import React, { useMemo, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'

import DaysPopover from '$shared/components/DaysPopover'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import MembersGraph from '$mp/containers/ProductPage/MembersGraph'
import useMemberStats from '$mp/modules/dataUnion/hooks/useMemberStats'
import useDataUnionStats from '$mp/containers/ProductPage/useDataUnionStats'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import { MEDIUM } from '$shared/utils/styled'

const Container = styled.div`
    display: grid;
    padding: 16px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 16px;
    border-top: 1px solid #EFEFEF;
`

const Box = styled.div`
    background: #FDFDFD;
    border: 1px solid #EFEFEF;
    border-radius: 4px;
`

const Heading = styled.div`
    font-weight: ${MEDIUM};
    font-size: 14px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: #323232;
`

type Props = {
    product: any,
}

const Management = ({ product }: Props) => {
    const [days, setDays] = useState(7)
    const dataUnion = useDataUnion()
    const { joinPartStreamId } = dataUnion || {}
    const { load: loadDataUnions, members } = useMemberStats()
    console.log(members)

    useEffect(() => {
        loadDataUnions()
    }, [loadDataUnions])

    return (
        <Container>
            <Box>
                <Heading>Manage join requests</Heading>
            </Box>
            <Box>
                <Heading>Manage members</Heading>
            </Box>
            <Box>
                <Heading>Subscribers</Heading>
            </Box>
            <Box>
                <TimeSeriesGraph.Header>
                    <Heading>Members</Heading>
                    <DaysPopover
                        onChange={setDays}
                        selectedItem={`${days}`}
                    />
                </TimeSeriesGraph.Header>
                <TimeSeriesGraph.Body>
                    <MembersGraph
                        joinPartStreamId={joinPartStreamId}
                        memberCount={0}
                        shownDays={days}
                    />
                </TimeSeriesGraph.Body>
            </Box>
        </Container>
    )
}

export default Management
