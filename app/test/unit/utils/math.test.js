import BN from 'bignumber.js'
import * as all from '$mp/utils/math'

describe('math utils', () => {
    describe('fromNano', () => {
        it('must transform the amount correctly', () => {
            expect(all.fromNano('10000000000')).toStrictEqual(BN(10))
        })
    })

    describe('toNano', () => {
        it('must transform the amount correctly', () => {
            expect(all.toNano(10)).toStrictEqual(BN('10000000000'))
            expect(all.toNano('10')).toStrictEqual(BN('10000000000'))
        })
    })

    describe('fromAtto', () => {
        it('must transform the amount correctly', () => {
            expect(all.fromAtto('10000000000000000000')).toStrictEqual(BN(10))
        })
    })

    describe('toAtto', () => {
        it('must transform the amount correctly', () => {
            expect(all.toAtto(10)).toStrictEqual(BN('10000000000000000000'))
            expect(all.toAtto('10')).toStrictEqual(BN('10000000000000000000'))
        })
    })
})
