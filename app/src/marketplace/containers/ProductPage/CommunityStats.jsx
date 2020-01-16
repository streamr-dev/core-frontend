// @flow

import React from 'react'

import useProduct from '$mp/containers/ProductController/useProduct'
import useCommunityProduct from '$mp/containers/ProductController/useCommunityProduct'
import { isEthereumAddress } from '$mp/utils/validate'
import useCommunityStats from './useCommunityStats'

import ProductContainer from '$shared/components/Container/Product'
import CommunityPending from '$mp/components/ProductPage/CommunityPending'
import StatsValues from '$shared/components/CommunityStats/Values'
import StatsHeader from '$shared/components/CommunityStats/Header'
import DonutChart from '$shared/components/DonutChart'

import MembersGraph from './MembersGraph'

import styles from './communityStats.pcss'

const CommunityStats = () => {
    const product = useProduct()
    const { statsArray, memberCount } = useCommunityStats()

    const { communityDeployed, beneficiaryAddress } = product
    const community = useCommunityProduct()

    const { joinPartStreamId } = community || {}

    if (!communityDeployed && !isEthereumAddress(beneficiaryAddress)) {
        return null
    }

    return (
        <ProductContainer className={styles.container}>
            <div className={styles.root}>
                <div className={styles.grid}>
                    <div className={styles.header}>
                        <span>Overview</span>
                    </div>
                    {!communityDeployed && isEthereumAddress(beneficiaryAddress) && (
                        <CommunityPending className={styles.communityPending} />
                    )}
                    {!!communityDeployed && statsArray && (
                        <StatsValues
                            className={styles.stats}
                            stats={statsArray}
                        />
                    )}
                    {!!communityDeployed && memberCount && (
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

export default CommunityStats
