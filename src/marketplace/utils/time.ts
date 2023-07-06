import moment, { Moment, unitOfTime } from 'moment'
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
): string =>
    timestamp && (moment as any).tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')

/**
 * Returns short form for given time unit.
 * @param timeUnit Time unit to abbreviate.
 */
export function getAbbreviation(timeUnit: TimeUnit) {
    return abbrMapping[timeUnit]
}

/**
 * Returns true if the given time is in the future.
 * @param time Time to check
 */
export const isActive = (time: string | number | Date | Moment): boolean =>
    moment().isBefore(time)
