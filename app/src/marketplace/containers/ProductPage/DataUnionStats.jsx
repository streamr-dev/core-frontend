// @flow

import React from 'react'

import useProduct from '$mp/containers/ProductController/useProduct'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import { isEthereumAddress } from '$mp/utils/validate'
import useDataUnionStats from './useDataUnionStats'

import ProductContainer from '$shared/components/Container/Product'
import DataUnionPending from '$mp/components/ProductPage/DataUnionPending'
import StatsValues from '$shared/components/DataUnionStats/Values'
import StatsHeader from '$shared/components/DataUnionStats/Header'
import DonutChart from '$shared/components/DonutChart'

import MembersGraph from './MembersGraph'

import styles from './dataUnionStats.pcss'

const DataUnionStats = () => {
    const product = useProduct()
    const { statsArray, memberCount } = useDataUnionStats()

    const { dataUnionDeployed, beneficiaryAddress } = product
    const dataUnion = useDataUnion()

    const { joinPartStreamId } = dataUnion || {}

    if (!dataUnionDeployed && !isEthereumAddress(beneficiaryAddress)) {
        return null
    }

    return (
        <ProductContainer className={styles.container}>
            <div className={styles.root}>
                <div className={styles.grid}>
                    <div className={styles.header}>
                        <span>Overview</span>
                    </div>
                    {!dataUnionDeployed && isEthereumAddress(beneficiaryAddress) && (
                        <DataUnionPending className={styles.dataUnionPending} />
                    )}
                    {!!dataUnionDeployed && statsArray && (
                        <StatsValues
                            className={styles.stats}
                            stats={statsArray}
                        />
                    )}
                    {!!dataUnionDeployed && memberCount && (
                        <div className={styles.graphs}>
                            <MembersGraph
                                className={styles.membersGraph}
                                joinPartStreamId={joinPartStreamId}
                                memberCount={memberCount.total}
                            />
                            <div className={styles.memberDonut}>
                                <StatsHeader>Members by status</StatsHeader>
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
}

export default DataUnionStats
