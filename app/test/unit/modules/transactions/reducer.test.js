import reducer, { initialState } from '$mp/modules/transactions/reducer'
import * as constants from '$mp/modules/transactions/constants'

describe('transactions - reducers', () => {
    it('has initial state', async () => {
        expect(reducer(undefined, {})).toStrictEqual(initialState)
    })

    it('adds transaction', () => {
        const id = 'txHash'
        const expectedState = {
            pending: [id],
            completed: [],
        }

        expect(reducer(undefined, {
            type: constants.ADD_TRANSACTION,
            payload: {
                id,
            },
        })).toStrictEqual(expectedState)
    })

    it('completes transaction', () => {
        const id = 'txHash'
        const expectedState = {
            pending: [],
            completed: [id],
        }

        expect(reducer(undefined, {
            type: constants.COMPLETE_TRANSACTION,
            payload: {
                id,
            },
        })).toStrictEqual(expectedState)
    })
})
