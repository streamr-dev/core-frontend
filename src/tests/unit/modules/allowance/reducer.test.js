import assert from 'assert-diff'

import { transactionStates } from '../../../../utils/constants'
import reducer, { initialState } from '../../../../modules/allowance/reducer'
import * as constants from '../../../../modules/allowance/constants'

describe('allowance - reducer', () => {
    it('has initial state', () => {
        assert.deepEqual(reducer(undefined, {}), initialState)
    })

    it('resets the allowance', () => {
        const startingState = {
            ...initialState,
            allowance: '200000000000000000000',
        }

        assert.deepEqual(reducer(startingState, {
            type: constants.RESET_ALLOWANCE,
            payload: {},
        }), initialState)
    })

    it('handles get request', () => {
        const expectedState = {
            ...initialState,
            gettingAllowance: true,
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.GET_ALLOWANCE_REQUEST,
            payload: {},
        }), expectedState)
    })

    it('handles get success', () => {
        const allowance = '200000000000000000000'
        const expectedState = {
            ...initialState,
            allowance,
            gettingAllowance: false,
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.GET_ALLOWANCE_SUCCESS,
            payload: {
                allowance,
            },
        }), expectedState)
    })

    it('handles get failure', () => {
        const error = new Error('Test')

        const expectedState = {
            ...initialState,
            gettingAllowance: false,
            error: {},
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.GET_ALLOWANCE_FAILURE,
            payload: {
                error,
            },
        }), expectedState)
    })

    it('handles set allowance request', () => {
        const allowance = '200000000000000000000'
        const expectedState = {
            ...initialState,
            settingAllowance: true,
            pendingAllowance: allowance,
            transactionState: transactionStates.STARTED,
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.SET_ALLOWANCE_REQUEST,
            payload: {
                allowance,
            },
        }), expectedState)
    })

    it('handles set allowance success', () => {
        const receipt = 'test'
        const expectedState = {
            ...initialState,
            settingAllowance: false,
            transactionState: transactionStates.CONFIRMED,
            receipt,
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.SET_ALLOWANCE_SUCCESS,
            payload: {
                receipt,
            },
        }), expectedState)
    })

    it('handles set allowance hash', () => {
        const hash = 'test'

        const expectedState = {
            ...initialState,
            settingAllowance: false,
            transactionState: transactionStates.PENDING,
            hash,
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.RECEIVE_SET_ALLOWANCE_HASH,
            payload: {
                hash,
            },
        }), expectedState)
    })

    it('handles set allowance error', () => {
        const error = new Error('Test')

        const expectedState = {
            ...initialState,
            settingAllowance: false,
            transactionState: transactionStates.FAILED,
            error: {},
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.SET_ALLOWANCE_FAILURE,
            payload: {
                error,
            },
        }), expectedState)
    })
})
