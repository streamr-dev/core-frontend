// @flow

import React, { useState } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import DataUnionPending from '$mp/components/ProductPage/DataUnionPending'
import AutoScrollHook from '$shared/components/AutoScrollHook'
import DonutChart from '$shared/components/DonutChart'
import Segment from '$shared/components/Segment'
import ProductStat from '$shared/components/ProductStat'
import DaysPopover from '$shared/components/DaysPopover'
import MembersGraph from './MembersGraph'
import { SM, MD } from '$shared/utils/styled'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'

type Props = {
    stats: Array<Object>,
    memberCount: ?{
        total: number,
        active: number,
        inactive: number,
    },
    joinPartStreamId?: ?string,
    showDeploying?: boolean,
}

const Members = styled.div`
    @media (min-width: ${SM}px) {
        flex-basis: 60%;
    }
`

const GroupedMembers = styled.div`
    border-top: 1px solid #e7e7e7;

    @media (min-width: ${SM}px) {
        border-left: 1px solid #e7e7e7;
        border-top: 0;
        flex-basis: 40%;
    }
`

const Graphs = styled.div`
    > div {
        padding: 24px;
    }

    @media (min-width: ${SM}px) {
        display: flex;

        > div {
            padding: 32px;
        }
    }
`

const GraphHeader = styled.div`
    align-items: center;
    display: flex;
    margin-bottom: 12px;

    ${ProductStat.Title} {
        flex-grow: 1;
    }
`

const GraphBody = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const UnstyledDataUnionStats = ({
    stats,
    memberCount,
    joinPartStreamId,
    showDeploying,
    ...props
}: Props) => {
    const [days, setDays] = useState(7)

    return (
        <Segment {...props}>
            <AutoScrollHook hash="stats" />
            <Segment.Header>
                <Translate value="productPage.stats.title" />
            </Segment.Header>
            {!!showDeploying && (
                <Segment.Body>
                    <DataUnionPending />
                </Segment.Body>
            )}
            {!showDeploying && !!stats && (
                <Segment.Body pad>
                    <ProductStat.List items={stats} />
                </Segment.Body>
            )}
            {!showDeploying && !!memberCount && (
                <Segment.Body>
                    <Graphs>
                        <Members>
                            <GraphHeader>
                                <ProductStat.Title>
                                    Members
                                </ProductStat.Title>
                                <DaysPopover
                                    onChange={setDays}
                                    selectedItem={`${days}`}
                                />
                            </GraphHeader>
                            <GraphBody>
                                <MembersGraph
                                    joinPartStreamId={joinPartStreamId}
                                    memberCount={memberCount.total}
                                    shownDays={days}
                                />
                            </GraphBody>
                        </Members>
                        <GroupedMembers>
                            <GraphHeader>
                                <ProductStat.Title>
                                    <Translate value="productPage.stats.membersDonut" />
                                </ProductStat.Title>
                            </GraphHeader>
                            <GraphBody>
                                <DonutChart
                                    strokeWidth={3}
                                    data={[
                                        {
                                            title: I18n.t('productPage.stats.activeMembers'),
                                            value: memberCount.active || 0,
                                            color: '#0324FF',
                                        },
                                        {
                                            title: I18n.t('productPage.stats.inactiveMembers'),
                                            value: memberCount.inactive || 0,
                                            color: '#FB0606',
                                        },
                                    ]}
                                />
                            </GraphBody>
                        </GroupedMembers>
                    </Graphs>
                </Segment.Body>
            )}
        </Segment>
    )
}

const DataUnionStats = styled(UnstyledDataUnionStats)`
    ${DataUnionPending} {
        padding: 4em 0;
    }

    ${TimeSeriesGraph} {
        width: 100%;
    }
`

export default DataUnionStats
