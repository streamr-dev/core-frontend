import { toBN } from '../../../src/utils/bn'
import * as all from '../../../src/marketplace/utils/price'

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
            const pps = '2'
            expect(all.priceForTimeUnits(pps, 0, 'second')).toStrictEqual(toBN(0))
            expect(all.priceForTimeUnits('0', 0, 'second')).toStrictEqual(toBN(0))
            expect(all.priceForTimeUnits(pps, 7, 'second')).toStrictEqual(toBN(14))
            expect(all.priceForTimeUnits(pps, 7, 'minute')).toStrictEqual(toBN(840))
            expect(all.priceForTimeUnits(pps, 7, 'hour')).toStrictEqual(toBN(50400))
            expect(all.priceForTimeUnits(pps, 7, 'day')).toStrictEqual(toBN(1209600))
            expect(all.priceForTimeUnits(pps, 7, 'week')).toStrictEqual(toBN(8467200))
            // expect(all.priceForTimeUnits(pps, 7, 'month')).toBe(36288000) depends on the month we're now
            expect(() => all.priceForTimeUnits(pps, 7, 'asdf')).toThrow()
        })
    })
    describe('formatDecimals', () => {
        it('displays, rounds and recognizes currency', () => {
            expect(all.formatDecimals(1, 'DATA')).toBe('1')
            expect(all.formatDecimals(1.234, 'DATA')).toBe('1.234')
            expect(all.formatDecimals(10, 'DATA')).toBe('10')
            expect(all.formatDecimals(12.34, 'DATA')).toBe('12.34')
            expect(all.formatDecimals(12.345, 'DATA')).toBe('12.35')
            expect(all.formatDecimals(123.45, 'DATA')).toBe('123.5')
            expect(all.formatDecimals(1234.5, 'DATA')).toBe('1235')
            expect(all.formatDecimals(1234, 'DATA')).toBe('1234')
            expect(all.formatDecimals(1, 'USD')).toBe('1.00')
            expect(all.formatDecimals(1.234, 'USD')).toBe('1.23')
            expect(all.formatDecimals(10, 'USD')).toBe('10.00')
            expect(all.formatDecimals(12.34, 'USD')).toBe('12.34')
            expect(all.formatDecimals(12.345, 'USD')).toBe('12.35')
            expect(all.formatDecimals(123.45, 'USD')).toBe('123.5')
            expect(all.formatDecimals(1234.5, 'USD')).toBe('1235')
            expect(all.formatDecimals(1234, 'USD')).toBe('1234')
        })
    })
    describe('pricePerSecondFromTimeUnit', () => {
        it('calculates PPS for time units', () => {
            expect(
                all.pricePerSecondFromTimeUnit(0, 'second', 18).toString(),
            ).toStrictEqual('0')
            expect(
                all.pricePerSecondFromTimeUnit(1, 'second', 18).toString(),
            ).toStrictEqual('1000000000000000000')
            expect(
                all.pricePerSecondFromTimeUnit(1, 'minute', 18).toString(),
            ).toStrictEqual('16666666666666667')
            expect(
                all.pricePerSecondFromTimeUnit(1, 'hour', 18).toString(),
            ).toStrictEqual('277777777777778')
            expect(all.pricePerSecondFromTimeUnit(1, 'day', 18).toString()).toStrictEqual(
                '11574074074074',
            )
            expect(
                all.pricePerSecondFromTimeUnit(1, 'week', 18).toString(),
            ).toStrictEqual('1653439153439')
            expect(() => all.pricePerSecondFromTimeUnit(0, 'asdf', 18)).toThrow()
        })
    })
    describe('formatDecimals', () => {
        it('displays, rounds and recognizes currency', () => {
            expect(all.formatDecimals(1, 'DATA')).toBe('1')
            expect(all.formatDecimals(1.234, 'DATA')).toBe('1.234')
            expect(all.formatDecimals(10, 'DATA')).toBe('10')
            expect(all.formatDecimals(12.34, 'DATA')).toBe('12.34')
            expect(all.formatDecimals(12.345, 'DATA')).toBe('12.35')
            expect(all.formatDecimals(123.45, 'DATA')).toBe('123.5')
            expect(all.formatDecimals(1234.5, 'DATA')).toBe('1235')
            expect(all.formatDecimals(1234, 'DATA')).toBe('1234')
            expect(all.formatDecimals(1, 'USD')).toBe('1.00')
            expect(all.formatDecimals(1.234, 'USD')).toBe('1.23')
            expect(all.formatDecimals(10, 'USD')).toBe('10.00')
            expect(all.formatDecimals(12.34, 'USD')).toBe('12.34')
            expect(all.formatDecimals(12.345, 'USD')).toBe('12.35')
            expect(all.formatDecimals(123.45, 'USD')).toBe('123.5')
            expect(all.formatDecimals(1234.5, 'USD')).toBe('1235')
            expect(all.formatDecimals(1234, 'USD')).toBe('1234')
        })
    })
    describe('getMostRelevantTimeUnit', () => {
        it('calculates the most relevant time unit', () => {
            expect(all.getMostRelevantTimeUnit(toBN(1))).toBe('second')
            expect(all.getMostRelevantTimeUnit(toBN(0.017))).toBe('minute')
            expect(all.getMostRelevantTimeUnit(toBN(0.0017))).toBe('hour')
            expect(all.getMostRelevantTimeUnit(toBN(0.00017))).toBe('day')
            expect(all.getMostRelevantTimeUnit(toBN(0.0000017))).toBe('week')
        })
    })
    describe('formatPrice', () => {
        it('works with all parameters given', () => {
            expect(all.formatPrice(toBN(1), 'DATA', toBN(18), 'second')).toBe(
                '1 DATA / s',
            )
            expect(all.formatPrice(toBN(1), 'DATA', toBN(18), 'minute')).toBe(
                '60 DATA / min',
            )
            expect(all.formatPrice(toBN(0.016666), 'DATA', toBN(18), 'minute')).toBe(
                '1 DATA / min',
            )
            expect(all.formatPrice(toBN(0.016666), 'DATA', toBN(18), 'hour')).toBe(
                '60 DATA / hr',
            )
            expect(all.formatPrice(toBN(1.004512), 'DATA', toBN(18), 'second')).toBe(
                '1.005 DATA / s',
            )
            expect(all.formatPrice(toBN(123.456789), 'DATA', toBN(18), 'second')).toBe(
                '123.5 DATA / s',
            )
            expect(all.formatPrice(toBN(123.512345), 'DATA', toBN(18), 'second')).toBe(
                '123.5 DATA / s',
            )
            expect(all.formatPrice(toBN(0.00000000008), 'DATA', toBN(18), 'second')).toBe(
                '0 DATA / s',
            )
            expect(all.formatPrice(toBN(0.0002777777), 'USD', toBN(18), 'hour')).toBe(
                '1.00 USD / hr',
            )
            expect(all.formatPrice(toBN(0.0002777777), 'USD', toBN(18), 'day')).toBe(
                '24.00 USD / d',
            )
            expect(all.formatPrice(toBN(0.0000115), 'USD', toBN(18), 'day')).toBe(
                '0.99 USD / d',
            )
            expect(all.formatPrice(toBN(0.0000115), 'USD', toBN(18), 'week')).toBe(
                '6.96 USD / wk',
            )
        })
        it('works without timeunit given', () => {
            expect(all.formatPrice(toBN(1), 'DATA', toBN(18))).toBe('1 DATA / s')
            expect(all.formatPrice(toBN(0.0166666666667), 'DATA', toBN(18))).toBe(
                '1 DATA / min',
            )
            expect(all.formatPrice(toBN(0.04), 'DATA', toBN(18))).toBe('2.4 DATA / min')
            expect(all.formatPrice(toBN(0.0002777777778), 'USD', toBN(18))).toBe(
                '1.00 USD / hr',
            )
            expect(all.formatPrice(toBN(0.000011574075), 'USD', toBN(18))).toBe(
                '1.00 USD / d',
            )
            expect(all.formatPrice(toBN(0.00005), 'USD', toBN(18))).toBe('4.32 USD / d')
            expect(all.formatPrice(toBN(0.00000165344), 'USD', toBN(18))).toBe(
                '1.00 USD / wk',
            )
        })
    })
})
