// @flow

import React, { useState } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import Container from '$shared/components/Container/Product'
import DataUnionPending from '$mp/components/ProductPage/DataUnionPending'
import AutoScrollHook from '$shared/components/AutoScrollHook'
import DonutChart from '$shared/components/DonutChart'
import Segment from '$shared/components/Segment'
import ProductStat from '$shared/components/ProductStat'
import DaysPopover from '$shared/components/DaysPopover'
import MembersGraph from './MembersGraph'

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

const Graphs = styled.div`
    display: flex;
    flex-wrap: wrap;

    > div {
        flex-basis: 60%;
    }

    > div + div {
        border-left: 1px solid #e7e7e7;
        flex-basis: 40%;
    }
`

const GraphHeader = styled.div`
    align-items: center;
    display: flex;

    ${ProductStat.Title} {
        flex-grow: 1;
    }
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
            <Container>
                <Segment.Header>
                    <Translate value="productPage.stats.title" />
                </Segment.Header>
                {!!showDeploying && (
                    <Segment.Body>
                        <DataUnionPending />
                    </Segment.Body>
                )}
                {!showDeploying && stats && (
                    <Segment.Body>
                        <ProductStat.List items={stats} />
                    </Segment.Body>
                )}
                {!showDeploying && memberCount && (
                    <Segment.Body>
                        <Graphs>
                            <div>
                                <GraphHeader>
                                    <ProductStat.Title>
                                        Members
                                    </ProductStat.Title>
                                    <DaysPopover
                                        onChange={setDays}
                                        selectedItem={`${days}`}
                                    />
                                </GraphHeader>
                                <MembersGraph
                                    joinPartStreamId={joinPartStreamId}
                                    memberCount={memberCount.total}
                                    shownDays={days}
                                />
                            </div>
                            <div>
                                <GraphHeader>
                                    <ProductStat.Title>
                                        <Translate value="productPage.stats.membersDonut" />
                                    </ProductStat.Title>
                                </GraphHeader>
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
                            </div>
                        </Graphs>
                    </Segment.Body>
                )}
            </Container>
        </Segment>
    )
}

const DataUnionStats = styled(UnstyledDataUnionStats)`
    ${DataUnionPending} {
        padding: 4em 0;
    }

    ${ProductStat.List} {
        padding: 4em 32px;
    }
`

export default DataUnionStats
