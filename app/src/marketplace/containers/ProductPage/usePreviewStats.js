import { useReducer, useMemo, useEffect } from 'react'

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

const handlers = {
    subscribers: (state, { subscriberCount }) => ({
        ...state,
        subscribers: {
            ...state.subscribers,
            value: subscriberCount || 0,
            loading: false,
        },
    }),

    adminFee: (state, { adminFee }) => ({
        ...state,
        revenueShare: {
            ...state.revenueShare,
            value: ((1 - adminFee) * 100).toFixed(0),
            loading: false,
        },
    }),

    created: (state, { created }) => ({
        ...state,
        created: {
            ...state.created,
            value: new Date(created).toLocaleDateString(),
            loading: false,
        },
    }),

    revenue: (state, { totalEarnings }) => ({
        ...state,
        revenue: {
            ...state.revenue,
            value: fromAtto(totalEarnings || 0).toFixed(0),
            loading: false,
        },
    }),

    members: (state, { activeMembers }) => ({
        ...state,
        members: {
            ...state.members,
            value: activeMembers || 0,
            loading: false,
        },
    }),

    averageRevenue: (state, { totalEarnings, created, totalMembers }) => {
        const productAgeMs = Date.now() - new Date(created).getTime()
        const revenuePerMonth = totalEarnings !== 0 ? (totalEarnings / (productAgeMs / MILLISECONDS_IN_MONTH)) : 0
        const revenuePerMonthPerMember = totalMembers > 0 ? (revenuePerMonth / totalMembers) : 0

        return {
            ...state,
            averageRevenue: {
                ...state.averageRevenue,
                value: fromAtto(revenuePerMonthPerMember).toFixed(1),
                loading: false,
            },
        }
    },
}

const reducer = (state, action) => (
    typeof handlers[action.type] === 'function' ?
        handlers[action.type](state, action) :
        state
)

function usePreviewStats({
    subscriberCount,
    adminFee,
    created,
    totalEarnings,
    memberCount,
} = {}) {
    const [stats, updateStats] = useReducer(reducer, initialStats)
    const { total: totalMembers, active: activeMembers } = memberCount || {}

    const statsArray = useMemo(() => Object.keys(stats).map((key) => ({
        ...stats[key],
        id: key,
    })), [stats])

    useEffect(() => {
        if (subscriberCount !== undefined) {
            updateStats({
                type: 'subscribers',
                subscriberCount,
            })
        }
    }, [subscriberCount])

    useEffect(() => {
        if (adminFee !== undefined) {
            updateStats({
                type: 'adminFee',
                adminFee,
            })
        }
    }, [adminFee])

    useEffect(() => {
        if (created !== undefined) {
            updateStats({
                type: 'created',
                created,
            })
        }
    }, [created])

    useEffect(() => {
        if (totalEarnings !== undefined) {
            updateStats({
                type: 'revenue',
                totalEarnings,
            })
        }
    }, [totalEarnings])

    useEffect(() => {
        if (activeMembers !== undefined) {
            updateStats({
                type: 'members',
                activeMembers,
            })
        }
    }, [activeMembers])

    useEffect(() => {
        if (totalEarnings !== undefined &&
            created !== undefined &&
            totalMembers !== undefined
        ) {
            updateStats({
                type: 'averageRevenue',
                totalEarnings,
                created,
                totalMembers,
            })
        }
    }, [totalEarnings, created, totalMembers])

    return useMemo(() => ({
        stats: statsArray,
    }), [
        statsArray,
    ])
}

export default usePreviewStats
