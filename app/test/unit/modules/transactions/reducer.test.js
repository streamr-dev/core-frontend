import assert from 'assert-diff'

import reducer, { initialState } from '$mp/modules/transactions/reducer'
import * as constants from '$mp/modules/transactions/constants'

describe('transactions - reducers', () => {
    it('has initial state', async () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    it('adds transaction', () => {
        const id = 'txHash'
        const expectedState = {
            pending: [id],
            completed: [],
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.ADD_TRANSACTION,
            payload: {
                id,
            },
        }), expectedState)
    })

    it('completes transaction', () => {
        const id = 'txHash'
        const expectedState = {
            pending: [],
            completed: [id],
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.COMPLETE_TRANSACTION,
            payload: {
                id,
            },
        }), expectedState)
    })
})
