import * as all from '../../../src/marketplace/utils/price'
import { toBigInt } from '../../../src/utils/bn'

describe('price utils', () => {
    describe('formatDecimals', () => {
        it('displays, rounds and recognizes currency', () => {
            expect(all.formatDecimals(toBigInt(1, 18n), 'DATA', 18n)).toBe('1')
            expect(all.formatDecimals(toBigInt(1.234, 18n), 'DATA', 18n)).toBe('1.234')
            expect(all.formatDecimals(toBigInt(10, 18n), 'DATA', 18n)).toBe('10')
            expect(all.formatDecimals(toBigInt(12.34, 18n), 'DATA', 18n)).toBe('12.34')
            expect(all.formatDecimals(toBigInt(12.345, 18n), 'DATA', 18n)).toBe('12.35')
            expect(all.formatDecimals(toBigInt(123.45, 18n), 'DATA', 18n)).toBe('123.5')
            expect(all.formatDecimals(toBigInt(1234.5, 18n), 'DATA', 18n)).toBe('1235')
            expect(all.formatDecimals(toBigInt(1234, 18n), 'DATA', 18n)).toBe('1234')
            expect(all.formatDecimals(toBigInt(1, 18n), 'USD', 18n)).toBe('1.00')
            expect(all.formatDecimals(toBigInt(1.234, 18n), 'USD', 18n)).toBe('1.23')
            expect(all.formatDecimals(toBigInt(10, 18n), 'USD', 18n)).toBe('10.00')
            expect(all.formatDecimals(toBigInt(12.34, 18n), 'USD', 18n)).toBe('12.34')
            expect(all.formatDecimals(toBigInt(12.345, 18n), 'USD', 18n)).toBe('12.35')
            expect(all.formatDecimals(toBigInt(123.45, 18n), 'USD', 18n)).toBe('123.5')
            expect(all.formatDecimals(toBigInt(1234.5, 18n), 'USD', 18n)).toBe('1235')
            expect(all.formatDecimals(toBigInt(1234, 18n), 'USD', 18n)).toBe('1234')
        })
    })

    describe('getMostRelevantTimeUnit', () => {
        it('calculates the most relevant time unit', () => {
            expect(all.getMostRelevantTimeUnit(1n, 18n)).toBe('second')
            expect(all.getMostRelevantTimeUnit(toBigInt(0.017, 18n), 18n)).toBe('minute')
            expect(all.getMostRelevantTimeUnit(toBigInt(0.0017, 18n), 18n)).toBe('hour')
            expect(all.getMostRelevantTimeUnit(toBigInt(0.00017, 18n), 18n)).toBe('day')
            expect(all.getMostRelevantTimeUnit(toBigInt(0.0000017, 18n), 18n)).toBe(
                'week',
            )
        })
    })
    describe('formatPrice', () => {
        it('works with all parameters given', () => {
            expect(all.formatPrice(toBigInt(1, 18n), 'DATA', 18n, 'second')).toBe(
                '1 DATA / s',
            )
            expect(all.formatPrice(toBigInt(1, 18n), 'DATA', 18n, 'minute')).toBe(
                '60 DATA / min',
            )
            expect(all.formatPrice(toBigInt(0.016666, 18n), 'DATA', 18n, 'minute')).toBe(
                '1 DATA / min',
            )
            expect(all.formatPrice(toBigInt(0.016666, 18n), 'DATA', 18n, 'hour')).toBe(
                '60 DATA / hr',
            )
            expect(all.formatPrice(toBigInt(1.004512, 18n), 'DATA', 18n, 'second')).toBe(
                '1.005 DATA / s',
            )
            expect(
                all.formatPrice(toBigInt(123.456789, 18n), 'DATA', 18n, 'second'),
            ).toBe('123.5 DATA / s')
            expect(
                all.formatPrice(toBigInt(123.512345, 18n), 'DATA', 18n, 'second'),
            ).toBe('123.5 DATA / s')
            expect(
                all.formatPrice(toBigInt(0.00000000008, 18n), 'DATA', 18n, 'second'),
            ).toBe('0 DATA / s')
            expect(all.formatPrice(toBigInt(0.0002777777, 18n), 'USD', 18n, 'hour')).toBe(
                '1.00 USD / hr',
            )
            expect(all.formatPrice(toBigInt(0.0002777777, 18n), 'USD', 18n, 'day')).toBe(
                '24.00 USD / d',
            )
            expect(all.formatPrice(toBigInt(0.0000115, 18n), 'USD', 18n, 'day')).toBe(
                '0.99 USD / d',
            )
            expect(all.formatPrice(toBigInt(0.0000115, 18n), 'USD', 18n, 'week')).toBe(
                '6.96 USD / wk',
            )
        })
        it('works without timeunit given', () => {
            expect(all.formatPrice(toBigInt(1, 18n), 'DATA', 18n)).toBe('1 DATA / s')
            expect(all.formatPrice(toBigInt(0.0166666666667, 18n), 'DATA', 18n)).toBe(
                '1 DATA / min',
            )
            expect(all.formatPrice(toBigInt(0.04, 18n), 'DATA', 18n)).toBe(
                '2.4 DATA / min',
            )
            expect(all.formatPrice(toBigInt(0.0002777777778, 18n), 'USD', 18n)).toBe(
                '1.00 USD / hr',
            )
            expect(all.formatPrice(toBigInt(0.000011574075, 18n), 'USD', 18n)).toBe(
                '1.00 USD / d',
            )
            expect(all.formatPrice(toBigInt(0.00005, 18n), 'USD', 18n)).toBe(
                '4.32 USD / d',
            )
            expect(all.formatPrice(toBigInt(0.00000165344, 18n), 'USD', 18n)).toBe(
                '1.00 USD / wk',
            )
        })
    })
})
