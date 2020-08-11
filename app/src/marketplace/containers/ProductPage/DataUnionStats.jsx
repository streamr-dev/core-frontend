// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import Container from '$shared/components/Container/Product'
import DataUnionPending from '$mp/components/ProductPage/DataUnionPending'
import AutoScrollHook from '$shared/components/AutoScrollHook'
import DonutChart from '$shared/components/DonutChart'
import Segment from '$shared/components/Segment'
import ProductStat from '$shared/components/ProductStat'
import MembersGraph from './MembersGraph'
import styles from './dataUnionStats.pcss'

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

const UnstyledDataUnionStats = ({
    stats,
    memberCount,
    joinPartStreamId,
    showDeploying,
    ...props
}: Props) => (
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
                    <div className={styles.graphs}>
                        <MembersGraph
                            className={styles.membersGraph}
                            joinPartStreamId={joinPartStreamId}
                            memberCount={memberCount.total}
                        />
                        <div className={styles.memberDonut}>
                            <ProductStat.Title>
                                <Translate value="productPage.stats.membersDonut" />
                            </ProductStat.Title>
                            <DonutChart
                                className={styles.donutChart}
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
                    </div>
                </Segment.Body>
            )}
        </Container>
    </Segment>
)

const DataUnionStats = styled(UnstyledDataUnionStats)`
    ${DataUnionPending} {
        padding: 4em 0;
    }

    ${ProductStat.List} {
        padding: 4em 32px;
    }
`

export default DataUnionStats
