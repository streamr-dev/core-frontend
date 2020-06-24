// @flow

import React from 'react'

import ProductContainer from '$shared/components/Container/Product'
import DataUnionPending from '$mp/components/ProductPage/DataUnionPending'
import StatsValues from '$shared/components/DataUnionStats'
import DonutChart from '$shared/components/DonutChart'

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

const DataUnionStats = ({ stats, memberCount, joinPartStreamId, showDeploying }: Props) => (
    <ProductContainer className={styles.container}>
        <div className={styles.root}>
            <div className={styles.grid}>
                <div className={styles.header}>
                    <span>Overview</span>
                </div>
                {!!showDeploying && (
                    <DataUnionPending className={styles.dataUnionPending} />
                )}
                {!showDeploying && stats && (
                    <StatsValues
                        className={styles.stats}
                        stats={stats}
                    />
                )}
                {!showDeploying && memberCount && (
                    <div className={styles.graphs}>
                        <MembersGraph
                            className={styles.membersGraph}
                            joinPartStreamId={joinPartStreamId}
                            memberCount={memberCount.total}
                        />
                        <div className={styles.memberDonut}>
                            <StatsValues.Header>Members by status</StatsValues.Header>
                            <DonutChart
                                className={styles.donutChart}
                                strokeWidth={3}
                                data={[
                                    {
                                        title: 'Active',
                                        value: memberCount.active || 0,
                                        color: '#0324FF',
                                    },
                                    {
                                        title: 'Inactive',
                                        value: memberCount.inactive || 0,
                                        color: '#FB0606',
                                    },
                                ]}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.footer} />
        </div>
    </ProductContainer>
)

export default DataUnionStats
