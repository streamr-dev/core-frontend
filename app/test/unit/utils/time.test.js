import moment from 'moment-timezone'
import BN from 'bignumber.js'

import * as all from '$mp/utils/time'

describe('time utils', () => {
    describe('toSeconds', () => {
        it('converts to seconds', () => {
            expect(all.toSeconds(1, 'second')).toStrictEqual(BN(1))
            expect(all.toSeconds(1, 'minute')).toStrictEqual(BN(60))
            expect(all.toSeconds(1, 'hour')).toStrictEqual(BN(3600))
            expect(all.toSeconds(1, 'day')).toStrictEqual(BN(86400))
            expect(all.toSeconds(1, 'week')).toStrictEqual(BN(604800))
            expect(all.toSeconds(1, 'month')).toStrictEqual(BN(2592000))
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
            expect(all.formatDateTime()).toBe(undefined)
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

    describe('isActive', () => {
        it('returns correct status', () => {
            expect(all.isActive(Date.now())).toBe(false)
            expect(all.isActive(moment())).toBe(false)
            expect(all.isActive(0)).toBe(false)
            expect(all.isActive(1)).toBe(false)
            expect(all.isActive('1970-01-01 00:00:00')).toBe(false)
            expect(all.isActive('2050-01-01 00:00:00')).toBe(true) // in the year 2050 someone will curse me
        })
    })
})
