import moment from 'moment-timezone'
import * as all from '~/marketplace/utils/time'

describe('time utils', () => {
    describe('toSeconds', () => {
        it('converts to seconds', () => {
            expect(all.toSeconds(1, 'second')).toStrictEqual(1)
            expect(all.toSeconds(1, 'minute')).toStrictEqual(60)
            expect(all.toSeconds(1, 'hour')).toStrictEqual(3600)
            expect(all.toSeconds(1, 'day')).toStrictEqual(86400)
            expect(all.toSeconds(1, 'week')).toStrictEqual(604800)
            expect(all.toSeconds(1, 'month')).toStrictEqual(2592000)
        })
        it('rejects invalid time units', () => {
            expect(() => all.toSeconds(1, 'asdf')).toThrow()
            expect(() => all.toSeconds(1, 'seconds')).toThrow()
        })
    })
    describe('formatDateTime', () => {
        it('formats datetime', () => {
            expect(all.formatDateTime(1, 'UTC')).toBe('1970-01-01 00:00:00')
            expect(all.formatDateTime(1, 'Europe/Helsinki')).toBe('1970-01-01 02:00:00')
            expect(all.formatDateTime(undefined, undefined)).toBe(undefined)
        })
    })
    describe('getAbbreviation', () => {
        it('displays abbreviation', () => {
            expect(all.getAbbreviation('second')).toBe('s')
            expect(all.getAbbreviation('minute')).toBe('min')
            expect(all.getAbbreviation('hour')).toBe('hr')
            expect(all.getAbbreviation('day')).toBe('d')
            expect(all.getAbbreviation('week')).toBe('wk')
            expect(all.getAbbreviation('month')).toBe('m')
            expect(all.getAbbreviation('asdf')).toBe('')
        })
    })
})
