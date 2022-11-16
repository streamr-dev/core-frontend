import React, { useState, useEffect, FunctionComponent } from 'react'
import styled from 'styled-components'
import DaysPopover from '$shared/components/DaysPopover'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import { getChainIdFromApiString } from '$shared/utils/chains'
import MembersGraph from '$mp/containers/ProductPage/MembersGraph'
import RevenueGraph from '$mp/containers/ProductPage/RevenueGraph'
import ProductController, { useController } from '$mp/containers/ProductController'
import { MEDIUM } from '$shared/utils/styled'
import ManageMembers from './ManageMembers'
const Container = styled.div`
    display: grid;
    padding: 16px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 16px;
    border-top: 1px solid #efefef;
`
const Box = styled.div`
    background: #fdfdfd;
    border: 1px solid #efefef;
    border-radius: 4px;
    width: 100%;
    padding: 32px 24px 16px 24px;
`
const Heading = styled.div`
    font-weight: ${MEDIUM};
    font-size: 14px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: #323232;
`
const StyledManageMembers = styled(ManageMembers)`
    grid-column: 1 / 3;
    grid-row: 1;
`
const GraphHeader = styled.div`
    margin-bottom: 32px;
`
const StyledDaysPopover = styled(DaysPopover)`
    width: 100%;
    justify-content: flex-end;
`
type Props = {
    product: any,
    dataUnion: any,
    pricingTokenDecimals: number,
    stats: any,
    className?: string,
}

const Management = ({
    product,
    dataUnion,
    pricingTokenDecimals,
    stats,
    className,
}: Props) => {
    const [memberDays, setMemberDays] = useState(7)
    const [revenueDays, setRevenueDays] = useState(7)
    const { loadDataUnion } = useController()
    const memberCount = (stats && stats.memberCount) || 0
    const currentRevenue = (stats && stats.totalEarnings) || 0
    const { beneficiaryAddress } = product
    const dataUnionId = beneficiaryAddress
    const chainId = getChainIdFromApiString(product.chain)
    useEffect(() => {
        if (beneficiaryAddress) {
            loadDataUnion(beneficiaryAddress, chainId)
        }

        return () => {}
    }, [beneficiaryAddress, loadDataUnion, chainId])
    return (
        <Container className={className}>
            <StyledManageMembers dataUnionId={dataUnionId} dataUnion={dataUnion} chainId={chainId} />
            <Box>
                <GraphHeader>
                    <TimeSeriesGraph.Header>
                        <Heading>
                            Revenue
                        </Heading>
                        <StyledDaysPopover
                            onChange={setRevenueDays}
                            selectedItem={`${revenueDays}`}
                        />
                    </TimeSeriesGraph.Header>
                </GraphHeader>
                {dataUnionId && (
                    <RevenueGraph
                        dataUnionAddress={dataUnionId}
                        currentRevenue={currentRevenue}
                        shownDays={revenueDays}
                        chainId={chainId}
                        pricingTokenDecimals={pricingTokenDecimals}
                    />
                )}
            </Box>
            <Box>
                <GraphHeader>
                    <TimeSeriesGraph.Header>
                        <Heading>Members</Heading>
                        <StyledDaysPopover
                            onChange={setMemberDays}
                            selectedItem={`${memberDays}`}
                        />
                    </TimeSeriesGraph.Header>
                </GraphHeader>
                {dataUnionId && (
                    <MembersGraph
                        dataUnionAddress={dataUnionId}
                        currentMemberCount={(memberCount && memberCount.total) || 0}
                        shownDays={memberDays}
                        chainId={chainId}
                    />
                )}
            </Box>
        </Container>
    )
}

const WrappedManagement: FunctionComponent<Props> = (props: Props) => (
    <ProductController>
        <Management {...props} />
    </ProductController>
)

export default WrappedManagement
