import { unitOfTime } from 'moment'
import moment from 'moment-timezone'
import { TimeUnit, timeUnits } from '~/shared/utils/timeUnit'

const momentDurationFormatsByTimeUnit: Record<TimeUnit, unitOfTime.DurationConstructor> =
    {
        [timeUnits.second]: 's',
        [timeUnits.minute]: 'm',
        [timeUnits.hour]: 'h',
        [timeUnits.day]: 'd',
        [timeUnits.week]: 'w',
        [timeUnits.month]: 'M',
    }

const abbrMapping: Record<TimeUnit, string> = {
    [timeUnits.second]: 's',
    [timeUnits.minute]: 'min',
    [timeUnits.hour]: 'hr',
    [timeUnits.day]: 'd',
    [timeUnits.week]: 'wk',
    [timeUnits.month]: 'm',
}

/**
 * Convert duration to seconds.
 * @param quantity Number of units to convert.
 * @param timeUnit Unit, e.g. day, hour, minute, etc.
 */
export function toSeconds(quantity: number, timeUnit: TimeUnit) {
    const format = momentDurationFormatsByTimeUnit[timeUnit]

    if (!format) {
        throw new Error(`Invalid time unit: ${timeUnit}`)
    }

    return Math.floor(moment.duration(quantity, format).asSeconds())
}

export const formatDateTime = (
    timestamp: number | null | undefined,
    timezone: string | null | undefined,
): string | undefined =>
    timestamp && timezone
        ? moment.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')
        : undefined

/**
 * Returns short form for given time unit.
 * @param timeUnit Time unit to abbreviate.
 */
export function getAbbreviation(timeUnit: TimeUnit) {
    return abbrMapping[timeUnit] || ''
}
