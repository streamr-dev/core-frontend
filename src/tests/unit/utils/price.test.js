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

    describe('fromNanoDollarString', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.fromNanoDollarString('10000000000'), 10)
        })
    })

    describe('toNanoDollarString', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.toNanoDollarString('10'), '10000000000')
        })
    })
})
