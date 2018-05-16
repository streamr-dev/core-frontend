import assert from 'assert-diff'

import * as all from '../../../utils/price'

describe('price utils', () => {
    describe('priceForTimeUnits', () => {
        it('should work without the digits parameter', () => {
            const pps = 2
            assert.equal(all.priceForTimeUnits(pps, 7, 'second'), 14)
            assert.equal(all.priceForTimeUnits(pps, 7, 'minute'), 840)
            assert.equal(all.priceForTimeUnits(pps, 7, 'hour'), 50400)
            assert.equal(all.priceForTimeUnits(pps, 7, 'day'), 1209600)
            assert.equal(all.priceForTimeUnits(pps, 7, 'week'), 8467200)
            // assert.equal(all.priceForTimeUnits(pps, 7, 'month'), 36288000) depends on the month we're now
        })
    })

    describe('formatDecimals', () => {
        it('should display, round and recognize currency correctly', () => {
            assert.equal(all.formatDecimals(1, 'DATA'), '1')
            assert.equal(all.formatDecimals(1.234, 'DATA'), '1.234')
            assert.equal(all.formatDecimals(10, 'DATA'), '10')
            assert.equal(all.formatDecimals(12.34, 'DATA'), '12.34')
            assert.equal(all.formatDecimals(12.345, 'DATA'), '12.35')
            assert.equal(all.formatDecimals(123.45, 'DATA'), '123.5')
            assert.equal(all.formatDecimals(1234.5, 'DATA'), '1235')
            assert.equal(all.formatDecimals(1234, 'DATA'), '1234')

            assert.equal(all.formatDecimals(1, 'USD'), '1.00')
            assert.equal(all.formatDecimals(1.234, 'USD'), '1.23')
            assert.equal(all.formatDecimals(10, 'USD'), '10.00')
            assert.equal(all.formatDecimals(12.34, 'USD'), '12.34')
            assert.equal(all.formatDecimals(12.345, 'USD'), '12.35')
            assert.equal(all.formatDecimals(123.45, 'USD'), '123.5')
            assert.equal(all.formatDecimals(1234.5, 'USD'), '1235')
            assert.equal(all.formatDecimals(1234, 'USD'), '1234')
        })
    })

    describe('formatPrice', () => {
        it('should work with all parameters given', () => {
            assert.equal(all.formatPrice(1, 'DATA', 1, 'second'), '1 DATA / s')
            assert.equal(all.formatPrice(1, 'DATA', 1, 'minute'), '60 DATA / min')
            assert.equal(all.formatPrice(0.016666, 'DATA', 1, 'minute'), '1 DATA / min')
            assert.equal(all.formatPrice(0.016666, 'DATA', 1, 'hour'), '60 DATA / hr')
            assert.equal(all.formatPrice(0.0002777777, 'USD', 1, 'hour'), '1 USD / hr')
            assert.equal(all.formatPrice(0.0002777777, 'USD', 1, 'day'), '24 USD / d')
            assert.equal(all.formatPrice(0.0000115, 'USD', 1, 'day'), '1 USD / d')
            assert.equal(all.formatPrice(0.0000115, 'USD', 1, 'week'), '7 USD / wk')
        })

        it('should work without providing an explicit timeUnit', () => {
            assert.equal(all.formatPrice(1, 'DATA', 1), '1 DATA / s')
            assert.equal(all.formatPrice(0.0166666666667, 'DATA', 1), '1 DATA / min')
            assert.equal(all.formatPrice(0.04, 'DATA', 1), '2.4 DATA / min')
            assert.equal(all.formatPrice(0.0002777777778, 'USD', 1), '1 USD / hr')
            assert.equal(all.formatPrice(0.000011574075, 'USD', 1), '1 USD / d')
            assert.equal(all.formatPrice(0.00005, 'USD', 1), '4.3 USD / d')
            assert.equal(all.formatPrice(0.00000165344, 'USD', 1), '1 USD / wk')
        })

        it('should round correctly', () => {
            assert.equal(all.formatPrice(1.004512, 'DATA', 4, 'second'), '1.0045 DATA / s')
            assert.equal(all.formatPrice(123.456789, 'DATA', 0, 'second'), '123 DATA / s')
            assert.equal(all.formatPrice(123.512345, 'DATA', 0, 'second'), '124 DATA / s')
            assert.equal(all.formatPrice(0.00000000008, 'DATA', 10, 'second'), '1e-10 DATA / s')
        })
    })
})
