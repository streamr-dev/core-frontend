import assert from 'assert-diff'

import * as all from '../../../utils/price'

describe('price utils', () => {
    describe('priceForPriceUnits', () => {
        it('should work without the digits parameter', () => {
            const pps = 2
            assert.equal(all.priceForPriceUnits(pps, 7, 'second'), 14)
            assert.equal(all.priceForPriceUnits(pps, 7, 'minute'), 840)
            assert.equal(all.priceForPriceUnits(pps, 7, 'hour'), 50400)
            assert.equal(all.priceForPriceUnits(pps, 7, 'day'), 1209600)
            assert.equal(all.priceForPriceUnits(pps, 7, 'week'), 8467200)
            // assert.equal(all.priceForPriceUnits(pps, 7, 'month'), 36288000) depends on the month we're now
        })
    })
})
