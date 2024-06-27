import * as all from '../../../src/marketplace/utils/price'
import { toBN, toBigInt } from '../../../src/utils/bn'

describe('price utils', () => {
    describe('isPriceValid', () => {
        it('works with positive number', () => {
            expect(all.isPriceValid('2')).toBe(true)
            expect(all.isPriceValid('300')).toBe(true)
            expect(all.isPriceValid(toBN(4e20))).toBe(true)
            expect(all.isPriceValid(toBN('4444562598.111772'))).toBe(true)
        })
        it('works with zero', () => {
            expect(all.isPriceValid('0')).toBe(false)
            expect(all.isPriceValid('0')).toBe(false)
            expect(all.isPriceValid(toBN(0))).toBe(false)
            expect(all.isPriceValid(toBN('0'))).toBe(false)
        })
        it('works with negative number', () => {
            expect(all.isPriceValid('-2')).toBe(false)
            expect(all.isPriceValid('-300')).toBe(false)
            expect(all.isPriceValid(toBN(-4e20))).toBe(false)
            expect(all.isPriceValid(toBN('-1234567.898765'))).toBe(false)
        })
        it('works with NaN', () => {
            expect(all.isPriceValid('NaN')).toBe(false)
        })
    })

    describe('priceForTimeUnits', () => {
        it('works without the digits parameter', () => {
            const pps = toBigInt(2, 18n)
            expect(all.priceForTimeUnits(pps, 0, 'second')).toEqual(0n)
            expect(all.priceForTimeUnits(0n, 0, 'second')).toEqual(0n)
            expect(all.priceForTimeUnits(pps, 7, 'second')).toEqual(toBigInt(14, 18n))
            expect(all.priceForTimeUnits(pps, 7, 'minute')).toEqual(toBigInt(840, 18n))
            expect(all.priceForTimeUnits(pps, 7, 'hour')).toEqual(toBigInt(50400, 18n))
            expect(all.priceForTimeUnits(pps, 7, 'day')).toEqual(toBigInt(1209600, 18n))
            expect(all.priceForTimeUnits(pps, 7, 'week')).toEqual(toBigInt(8467200, 18n))
        })
    })

    describe('pricePerSecondFromTimeUnit', () => {
        it('calculates PPS for time units', () => {
            expect(all.pricePerSecondFromTimeUnit(0n, 'second').toString()).toStrictEqual(
                '0',
            )
            expect(
                all.pricePerSecondFromTimeUnit(toBigInt(1, 18n), 'second').toString(),
            ).toStrictEqual('1000000000000000000')
            expect(
                all.pricePerSecondFromTimeUnit(toBigInt(1, 18n), 'minute').toString(),
            ).toStrictEqual('16666666666666667')
            expect(
                all.pricePerSecondFromTimeUnit(toBigInt(1, 18n), 'hour').toString(),
            ).toStrictEqual('277777777777778')
            expect(
                all.pricePerSecondFromTimeUnit(toBigInt(1, 18n), 'day').toString(),
            ).toStrictEqual('11574074074074')
            expect(
                all.pricePerSecondFromTimeUnit(toBigInt(1, 18n), 'week').toString(),
            ).toStrictEqual('1653439153439')
        })
    })

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
