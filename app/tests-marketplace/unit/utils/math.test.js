import assert from 'assert-diff'

import * as all from '../../../src/utils/math'

describe('math utils', () => {
    describe('fromNano', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.fromNano('10000000000'), 10)
        })
    })

    describe('toNano', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.toNano(10), '10000000000')
            assert.equal(all.toNano('10'), '10000000000')
        })
    })

    describe('fromAtto', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.fromAtto('10000000000000000000'), 10)
        })
    })

    describe('toAtto', () => {
        it('must transform the amount correctly', () => {
            assert.equal(all.toAtto(10), '10000000000000000000')
            assert.equal(all.toAtto('10'), '10000000000000000000')
        })
    })
})
