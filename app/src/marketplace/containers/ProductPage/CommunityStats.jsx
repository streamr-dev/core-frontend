// @flow

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'

import useProduct from '$mp/containers/ProductController/useProduct'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import useCommunityProduct from '$mp/containers/ProductController/useCommunityProduct'
import useIsMounted from '$shared/hooks/useIsMounted'
import { getCommunityStats } from '$mp/modules/communityProduct/services'
import { fromAtto } from '$mp/utils/math'
import { isEthereumAddress } from '$mp/utils/validate'

import ProductContainer from '$shared/components/Container/Product'
import CommunityPending from '$mp/components/ProductPage/CommunityPending'
import StatsValues from '$shared/components/CommunityStats/Values'
import StatsHeader from '$shared/components/CommunityStats/Header'
import DonutChart from '$shared/components/DonutChart'

import MembersGraph from './MembersGraph'

import styles from './communityStats.pcss'

const initialStats = {
    revenue: {
        label: 'Total product revenue',
        unit: 'DATA',
        loading: true,
    },
    members: {
        label: 'Active Members',
        loading: true,
    },
    averageRevenue: {
        label: 'Avg rev member / month',
        unit: 'DATA',
        loading: true,
    },
    subscribers: {
        label: 'Subscribers',
        loading: true,
    },
    adminFee: {
        label: 'Admin Fee',
        unit: '%',
        loading: true,
    },
    created: {
        label: 'Product created',
        loading: true,
    },
}

const CP_SERVER_POLL_INTERVAL_MS = 10000
const MILLISECONDS_IN_MONTH = 1000 * 60 * 60 * 24 * 30

const CommunityStats = () => {
    const product = useProduct()
    const contractProduct = useContractProduct()
    const [stats, setStats] = useState(initialStats)
    const [totalEarnings, setTotalEarnings] = useState(null)
    const [memberCount, setMemberCount] = useState(null)
    const isMounted = useIsMounted()

    const { communityDeployed, created, beneficiaryAddress } = product
    const community = useCommunityProduct()

    const { subscriberCount } = contractProduct || {}
    const { adminFee, joinPartStreamId } = community || {}

    useEffect(() => {
        setStats((prev) => ({
            ...prev,
            revenue: {
                ...prev.revenue,
                value: fromAtto(totalEarnings || 0).toFixed(0),
                loading: false,
            },
        }))
    }, [totalEarnings])

    useEffect(() => {
        setStats((prev) => ({
            ...prev,
            subscribers: {
                ...prev.subscribers,
                value: subscriberCount || 0,
                loading: false,
            },
        }))
    }, [subscriberCount])

    useEffect(() => {
        if (adminFee) {
            setStats((prev) => ({
                ...prev,
                adminFee: {
                    ...prev.adminFee,
                    value: (adminFee * 100).toFixed(0),
                    loading: false,
                },
            }))
        }
    }, [adminFee])

    useEffect(() => {
        if (created) {
            setStats((prev) => ({
                ...prev,
                created: {
                    ...prev.created,
                    value: new Date(created).toLocaleDateString(),
                    loading: false,
                },
            }))
        }
    }, [created])

    useEffect(() => {
        if (totalEarnings !== null && created && memberCount) {
            const productAgeMs = Date.now() - new Date(created).getTime()
            const revenuePerMonth = totalEarnings !== 0 ? (totalEarnings / (productAgeMs / MILLISECONDS_IN_MONTH)) : 0
            const revenuePerMonthPerMember = memberCount.total > 0 ? (revenuePerMonth / memberCount.total) : 0

            setStats((prev) => ({
                ...prev,
                averageRevenue: {
                    ...prev.averageRevenue,
                    value: fromAtto(revenuePerMonthPerMember).toFixed(1),
                    loading: false,
                },
            }))
        }
    }, [totalEarnings, created, memberCount])

    useEffect(() => {
        const { active } = memberCount || {}

        setStats((prev) => ({
            ...prev,
            members: {
                ...prev.members,
                value: active || 0,
                loading: false,
            },
        }))
    }, [memberCount])

    const timeOutId = useRef(null)
    const resetTimeout = useCallback(() => {
        clearTimeout(timeOutId.current)
    }, [])

    const getStats = useCallback(async () => {
        if (!beneficiaryAddress) { return }
        try {
            const result = await getCommunityStats(beneficiaryAddress)
            if (!isMounted()) {
                return
            }
            setTotalEarnings(result.totalEarnings)
            setMemberCount(result.memberCount)
        } catch (e) {
            // Try again if status is 404, it means API might not be up yet
            if (e.statusCode && e.statusCode === 404) {
                console.warn(e)
                resetTimeout()
                timeOutId.current = setTimeout(getStats, CP_SERVER_POLL_INTERVAL_MS)
            } else {
                // Otherwise pass the error on
                throw e
            }
        }
    }, [beneficiaryAddress, timeOutId, resetTimeout, isMounted])

    useEffect(() => {
        getStats()

        return () => {
            resetTimeout()
        }
    }, [getStats, resetTimeout])

    const statsArray = useMemo(() => Object.keys(stats).map((key) => ({
        id: key,
        ...stats[key],
    })), [stats])

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
                        <CommunityPending />
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
