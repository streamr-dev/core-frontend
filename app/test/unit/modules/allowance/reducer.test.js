import assert from 'assert-diff'
import BN from 'bignumber.js'

import reducer, { initialState } from '../../../../src/marketplace/modules/allowance/reducer'
import * as constants from '../../../../src/marketplace/modules/allowance/constants'

describe('allowance - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('RESET_ALLOWANCE_STATE', () => {
        it('resets the allowance state', () => {
            const startingState = {
                ...initialState,
                allowance: '200000000000000000000',
            }

            assert.deepStrictEqual(reducer(startingState, {
                type: constants.RESET_ALLOWANCE_STATE,
                payload: {},
            }), initialState)
        })
    })

    describe('GET_ALLOWANCE', () => {
        it('handles get request', () => {
            const expectedState = {
                ...initialState,
                gettingAllowance: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
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

            assert.deepStrictEqual(reducer(undefined, {
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
                getAllowanceError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_ALLOWANCE_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('SET_ALLOWANCE', () => {
        it('handles set allowance request', () => {
            const allowance = '200000000000000000000'
            const expectedState = {
                ...initialState,
                settingAllowance: true,
                pendingAllowance: allowance,
                setAllowanceTx: null,
                setAllowanceError: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_ALLOWANCE_REQUEST,
                payload: {
                    allowance,
                },
            }), expectedState)
        })

        it('handles set allowance success', () => {
            const expectedState = {
                ...initialState,
                settingAllowance: false,
                pendingAllowance: null,
                allowance: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_ALLOWANCE_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles set allowance success when transaction has started', () => {
            const state = {
                ...initialState,
                settingAllowance: true,
                pendingAllowance: '1234',
            }
            const expectedState = {
                ...initialState,
                settingAllowance: false,
                pendingAllowance: null,
                allowance: '1234',
            }

            assert.deepStrictEqual(reducer(state, {
                type: constants.SET_ALLOWANCE_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles set allowance hash', () => {
            const hash = 'test'

            const expectedState = {
                ...initialState,
                setAllowanceTx: hash,
            }

            assert.deepStrictEqual(reducer(undefined, {
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
                setAllowanceError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_ALLOWANCE_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('RESET_ALLOWANCE', () => {
        it('handles reset allowance request when not setting allowance', () => {
            const expectedState = {
                ...initialState,
                settingAllowance: false,
                resettingAllowance: true,
                pendingAllowance: BN(0),
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.RESET_ALLOWANCE_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles reset allowance request when not setting allowance', () => {
            const state = {
                ...initialState,
                settingAllowance: true,
                pendingAllowance: '10000',
            }
            const expectedState = {
                ...state,
                resettingAllowance: true,
                pendingAllowance: '10000',
                resetAllowanceTx: null,
                resetAllowanceError: null,
            }

            assert.deepStrictEqual(reducer(state, {
                type: constants.RESET_ALLOWANCE_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles reset allowance success when setting allowance', () => {
            const state = {
                ...initialState,
                settingAllowance: true,
                resettingAllowance: true,
                pendingAllowance: '12333',
                allowance: '10',
            }
            const expectedState = {
                ...state,
                resettingAllowance: false,
                allowance: '10',
                pendingAllowance: '12333',
                resetAllowanceError: null,
            }

            assert.deepStrictEqual(reducer(state, {
                type: constants.RESET_ALLOWANCE_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles reset allowance success when transaction has started and setting allowance', () => {
            const state = {
                ...initialState,
                settingAllowance: false,
                pendingAllowance: '1234',
            }
            const expectedState = {
                ...initialState,
                resettingAllowance: false,
                pendingAllowance: null,
                allowance: '1234',
            }

            assert.deepStrictEqual(reducer(state, {
                type: constants.RESET_ALLOWANCE_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles reset allowance hash', () => {
            const hash = 'test'

            const expectedState = {
                ...initialState,
                resetAllowanceTx: hash,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.RECEIVE_RESET_ALLOWANCE_HASH,
                payload: {
                    hash,
                },
            }), expectedState)
        })

        it('handles reset allowance error', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                resettingAllowance: false,
                resetAllowanceError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.RESET_ALLOWANCE_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })
})
