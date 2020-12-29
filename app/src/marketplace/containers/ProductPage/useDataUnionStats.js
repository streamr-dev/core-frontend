import { useState, useEffect, useMemo } from 'react'

import { fromAtto } from '$mp/utils/math'

const initialStats = {
    revenue: {
        unit: 'DATA',
        loading: true,
    },
    members: {
        loading: true,
    },
    averageRevenue: {
        unit: 'DATA',
        loading: true,
    },
    subscribers: {
        loading: true,
    },
    revenueShare: {
        unit: '%',
        loading: true,
    },
    created: {
        loading: true,
    },
}

const MILLISECONDS_IN_MONTH = 1000 * 60 * 60 * 24 * 30

function useDataUnionStats({
    created,
    adminFee,
    subscriberCount,
    totalEarnings,
    memberCount,
} = {}) {
    const [stats, setStats] = useState(initialStats)

    useEffect(() => {
        if (totalEarnings !== undefined) {
            setStats((prev) => ({
                ...prev,
                revenue: {
                    ...prev.revenue,
                    value: fromAtto(totalEarnings || 0).toFixed(0),
                    loading: false,
                },
            }))
        }
    }, [totalEarnings])

    useEffect(() => {
        if (subscriberCount !== undefined) {
            setStats((prev) => ({
                ...prev,
                subscribers: {
                    ...prev.subscribers,
                    value: subscriberCount || 0,
                    loading: false,
                },
            }))
        }
    }, [subscriberCount])

    useEffect(() => {
        if (adminFee !== undefined) {
            setStats((prev) => ({
                ...prev,
                revenueShare: {
                    ...prev.revenueShare,
                    value: ((1 - (+adminFee)) * 100).toFixed(0),
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
        if (totalEarnings !== undefined && created && memberCount) {
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
        if (memberCount) {
            setStats((prev) => ({
                ...prev,
                members: {
                    ...prev.members,
                    value: memberCount.active || 0,
                    loading: false,
                },
            }))
        }
    }, [memberCount])

    return useMemo(() => Object.keys(stats).map((key) => ({
        ...stats[key],
        id: key,
    })), [stats])
}

export default useDataUnionStats
