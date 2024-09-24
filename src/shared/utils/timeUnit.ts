import { Values } from '~/types'

export const timeUnits = {
    second: 'second',
    minute: 'minute',
    hour: 'hour',
    day: 'day',
    week: 'week',
    month: 'month',
} as const

export type TimeUnit = Values<typeof timeUnits>

export const timeUnitSecondsMultiplierMap = new Map<TimeUnit, number>([
    ['second', 1],
    ['minute', 60],
    ['hour', 3600],
    ['day', 86400],
    ['week', 604800],
    ['month', 2.628e6],
])
