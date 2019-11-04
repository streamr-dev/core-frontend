// @flow

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Skeleton from 'react-loading-skeleton'

import useProduct from '$mp/containers/ProductController/useProduct'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import useCommunityProduct from '$mp/containers/ProductController/useCommunityProduct'
import usePending from '$shared/hooks/usePending'
import ProductContainer from '$shared/components/Container/Product'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import useIsMounted from '$shared/hooks/useIsMounted'
import { getCommunityStats } from '$mp/modules/communityProduct/services'
import { fromAtto } from '$mp/utils/math'

import CommunityPending from '$mp/components/ProductPage/CommunityPending'
import CommunityStatsComponent from '$mp/components/ProductPage/CommunityStats'
import DonutChart from '$shared/components/DonutChart'
import Dropdown from '$shared/components/Dropdown'
import MembersGraph from '$mp/components/ProductPage/MembersGraph'

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
    const [shownDays, setShownDays] = useState(7)
    const isMounted = useIsMounted()

    const { communityDeployed, created, beneficiaryAddress } = product
    const community = useCommunityProduct()
    const { isPending } = usePending('communityProduct.LOAD')

    const authApiKeyId = useSelector(selectAuthApiKeyId)
    const { subscriberCount } = contractProduct || {}
    const { adminFee, joinPartStreamId } = community || {}

    useEffect(() => {
        if (totalEarnings) {
            setStats((prev) => ({
                ...prev,
                revenue: {
                    ...prev.revenue,
                    value: fromAtto(totalEarnings).toNumber() || 0,
                    loading: false,
                },
            }))
        }
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
        if (totalEarnings && created && memberCount) {
            const productAgeMs = Date.now() - new Date(created || 0).getTime()
            const revenuePerMonth = totalEarnings !== 0 ? (totalEarnings / (productAgeMs / MILLISECONDS_IN_MONTH)) : 0
            const revenuePerMonthPerMember = memberCount.total > 0 ? (revenuePerMonth / memberCount.total) : 0

            setStats((prev) => ({
                ...prev,
                averageRevenue: {
                    ...prev.averageRevenue,
                    value: revenuePerMonthPerMember,
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
            // Try again
            resetTimeout()
            timeOutId.current = setTimeout(getStats, CP_SERVER_POLL_INTERVAL_MS)
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

    return (
        <ProductContainer>
            <div className={styles.root}>
                <div className={styles.grid}>
                    <div className={styles.header}>
                        <span>Overview</span>
                    </div>
                    {!communityDeployed && (
                        <CommunityPending />
                    )}
                    {!!communityDeployed && statsArray && (
                        <CommunityStatsComponent
                            className={styles.stats}
                            stats={statsArray}
                        />
                    )}
                    {!!communityDeployed && memberCount && (
                        <div className={styles.graphs}>
                            <div className={styles.memberContainer}>
                                <div className={styles.memberHeadingContainer}>
                                    <div className={styles.statHeading}>Members</div>
                                    <Dropdown
                                        title=""
                                        selectedItem={shownDays.toString()}
                                        onChange={(item) => setShownDays(Number(item))}
                                        className={styles.memberGraphDropdown}
                                        toggleStyle="small"
                                    >
                                        <Dropdown.Item value="7">Last 7 days</Dropdown.Item>
                                        <Dropdown.Item value="28">Last 28 days</Dropdown.Item>
                                        <Dropdown.Item value="90">Last 90 days</Dropdown.Item>
                                    </Dropdown>
                                </div>
                                <MembersGraph
                                    className={styles.graph}
                                    authApiKeyId={authApiKeyId}
                                    joinPartStreamId={joinPartStreamId}
                                    memberCount={memberCount.total}
                                    shownDays={shownDays}
                                />
                            </div>
                            <div className={styles.memberDonut}>
                                <div className={styles.statHeading}>Members by status</div>
                                <DonutChart
                                    className={styles.graph}
                                    strokeWidth={3}
                                    data={[
                                        {
                                            title: 'Active',
                                            value: memberCount.active,
                                            color: '#0324FF',
                                        },
                                        {
                                            title: 'Inactive',
                                            value: memberCount.inactive,
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
