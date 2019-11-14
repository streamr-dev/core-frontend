import assert from 'assert-diff'

import reducer, { initialState } from '$mp/modules/deprecated/purchaseDialog/reducer'
import * as constants from '$mp/modules/deprecated/purchaseDialog/constants'
import { RECEIVE_SET_ALLOWANCE_HASH, RECEIVE_RESET_ALLOWANCE_HASH } from '$mp/modules/allowance/constants'
import { RECEIVE_PURCHASE_HASH } from '$mp/modules/purchase/constants'

describe('purchaseDialog - reducer', () => {
    const productId = '12345'

    it('has initial state', () => {
        assert.deepEqual(reducer(undefined, {}), initialState)
    })

    it('initializes a purchase', () => {
        const expectedState = {
            productId,
            data: null,
            step: 'accessPeriod',
            stepParams: null,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.INIT_PURCHASE,
            payload: {
                id: productId,
            },
        }), expectedState)
    })

    it('handles SET_STEP action (sets the correct step)', () => {
        const expectedState = {
            productId: null,
            data: null,
            step: 'allowance',
            stepParams: undefined,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.SET_STEP,
            payload: {
                step: 'allowance',
            },
        }), expectedState)
    })

    it('handles SET_STEP action with params (sets the correct step)', () => {
        const expectedState = {
            productId: null,
            data: null,
            step: 'allowance',
            stepParams: {
                test: true,
            },
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.SET_STEP,
            payload: {
                step: 'allowance',
                params: {
                    test: true,
                },
            },
        }), expectedState)
    })

    it('handles SET_ACCESS_PERIOD action', () => {
        const expectedState = {
            productId: null,
            data: {
                time: '1',
                timeUnit: 'day',
            },
            step: 'accessPeriod',
            stepParams: null,
        }
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.SET_ACCESS_PERIOD,
            payload: {
                time: '1',
                timeUnit: 'day',
            },
        }), expectedState)
    })

    it('handles RECEIVE_SET_ALLOWANCE_HASH action when allowance is replaced', () => {
        const state = {
            productId: null,
            data: null,
            step: 'resetAllowance',
            stepParams: null,
        }
        const expectedState = {
            productId: null,
            data: null,
            step: 'summary',
            stepParams: null,
        }

        assert.deepStrictEqual(reducer(state, {
            type: RECEIVE_SET_ALLOWANCE_HASH,
            payload: {},
        }), expectedState)
    })

    it('handles RECEIVE_RESET_ALLOWANCE_HASH action when allowance is reset', () => {
        const state = {
            productId: null,
            data: null,
            step: 'allowance',
            stepParams: null,
        }
        const expectedState = {
            productId: null,
            data: null,
            step: 'allowance',
            stepParams: null,
        }

        assert.deepStrictEqual(reducer(state, {
            type: RECEIVE_RESET_ALLOWANCE_HASH,
            payload: {},
        }), expectedState)
    })

    it('handles RECEIVE_PURCHASE_HASH action', () => {
        const expectedState = {
            productId: null,
            data: null,
            step: 'complete',
            stepParams: null,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: RECEIVE_PURCHASE_HASH,
        }), expectedState)
    })
})
