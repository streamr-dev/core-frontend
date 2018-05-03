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
