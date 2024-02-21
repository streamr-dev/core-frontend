import * as all from '~/marketplace/utils/math'
import { toBN } from '~/utils/bn'

describe('math utils', () => {
    describe('fromAtto', () => {
        it('must transform the amount correctly', () => {
            expect(all.fromAtto('10000000000000000000')).toStrictEqual(toBN(10))
        })
    })
    describe('toAtto', () => {
        it('must transform the amount correctly', () => {
            expect(all.toAtto('10')).toStrictEqual(toBN('10000000000000000000'))
            expect(all.toAtto('10')).toStrictEqual(toBN('10000000000000000000'))
        })
    })
})
