import assert from 'assert-diff'

import * as all from '../../../utils/math'

describe('math utils', () => {
    describe('fromNano', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.fromNano('10000000000'), 10)
        })
    })

    describe('toNanoString', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.toNanoString(10), '10000000000')
            assert.equal(all.toNanoString('10'), '10000000000')
        })
    })

    describe('fromAtto', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.fromAtto('10000000000000000000'), 10)
        })
    })

    describe('toAttoString', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.toAttoString(10), '10000000000000000000')
            assert.equal(all.toAttoString('10'), '10000000000000000000')
        })
    })
})
