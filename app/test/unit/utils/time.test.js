import assert from 'assert-diff'
import moment from 'moment-timezone'

import * as all from '../../../src/utils/time'

describe('time utils', () => {
    describe('toSeconds', () => {
        it('converts to seconds', () => {
            assert.equal(all.toSeconds(1, 'second'), 1)
            assert.equal(all.toSeconds(1, 'minute'), 60)
            assert.equal(all.toSeconds(1, 'hour'), 3600)
            assert.equal(all.toSeconds(1, 'day'), 86400)
            assert.equal(all.toSeconds(1, 'week'), 604800)
            assert.equal(all.toSeconds(1, 'month'), 2592000)
        })

        it('rejects invalid time units', () => {
            assert.throws(() => all.toSeconds(1, 'asdf'))
            assert.throws(() => all.toSeconds(1, 'seconds'))
        })
    })

    describe('formatDateTime', () => {
        it('formats datetime', () => {
            assert.equal(all.formatDateTime(1, 'UTC'), '1970-01-01 00:00:00')
            assert.equal(all.formatDateTime(1, 'Europe/Helsinki'), '1970-01-01 02:00:00')
            assert.equal(all.formatDateTime(), undefined)
        })
    })

    describe('getAbbreviation', () => {
        it('displays abbreviation', () => {
            assert.equal(all.getAbbreviation('second'), 's')
            assert.equal(all.getAbbreviation('minute'), 'min')
            assert.equal(all.getAbbreviation('hour'), 'hr')
            assert.equal(all.getAbbreviation('day'), 'd')
            assert.equal(all.getAbbreviation('week'), 'wk')
            assert.equal(all.getAbbreviation('month'), 'm')
            assert.equal(all.getAbbreviation('asdf'), '')
        })
    })

    describe('isActive', () => {
        it('returns correct status', () => {
            assert.equal(all.isActive(Date.now()), false)
            assert.equal(all.isActive(moment()), false)
            assert.equal(all.isActive(0), false)
            assert.equal(all.isActive(1), false)
            assert.equal(all.isActive('1970-01-01 00:00:00'), false)
            assert.equal(all.isActive('2050-01-01 00:00:00'), true) // in the year 2050 someone will curse me
        })
    })
})
