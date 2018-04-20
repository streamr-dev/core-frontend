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

    describe('formatPrice', () => {
        it('should work with all parameters given', () => {
            assert.equal(all.formatPrice(1, 'DATA', 2, 'second'), '1.00 DATA per second')
            assert.equal(all.formatPrice(1, 'DATA', 2, 'minute'), '60.00 DATA per minute')
            assert.equal(all.formatPrice(0.016666, 'DATA', 2, 'minute'), '1.00 DATA per minute')
            assert.equal(all.formatPrice(0.016666, 'DATA', 2, 'hour'), '60.00 DATA per hour')
            assert.equal(all.formatPrice(0.0002777777, 'USD', 4, 'hour'), '1.0000 USD per hour')
            assert.equal(all.formatPrice(0.0002777777, 'USD', 4, 'day'), '24.0000 USD per day')
            assert.equal(all.formatPrice(0.0000115, 'USD', 1, 'day'), '1.0 USD per day')
            assert.equal(all.formatPrice(0.0000115, 'USD', 1, 'week'), '7.0 USD per week')
        })

        it('should work without providing an explicit timeUnit', () => {
            assert.equal(all.formatPrice(1, 'DATA', 0), '1 DATA per second')
            assert.equal(all.formatPrice(0.0166666666667, 'DATA', 2), '1.00 DATA per minute')
            assert.equal(all.formatPrice(0.04, 'DATA', 2), '2.40 DATA per minute')
            assert.equal(all.formatPrice(0.0002777777778, 'USD', 4), '1.0000 USD per hour')
            assert.equal(all.formatPrice(0.000011574075, 'USD', 1), '1.0 USD per day')
            assert.equal(all.formatPrice(0.00005, 'USD', 1), '4.3 USD per day')
            assert.equal(all.formatPrice(0.00000165344, 'USD', 1), '1.0 USD per week')
        })
    })

    describe('fromNanoDollars', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.fromNanoDollars('10000000000'), 10)
        })
    })

    describe('toNanoDollarString', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.toNanoDollarString('10'), '10000000000')
        })
    })
})
