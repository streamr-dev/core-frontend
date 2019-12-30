import assert from 'assert-diff'
import BN from 'bignumber.js'

import reducer, { initialState } from '$mp/modules/allowance/reducer'
import * as constants from '$mp/modules/allowance/constants'

describe('allowance - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('RESET_DATA_ALLOWANCE_STATE', () => {
        it('resets the allowance state', () => {
            const startingState = {
                ...initialState,
                allowance: '200000000000000000000',
            }

            assert.deepStrictEqual(reducer(startingState, {
                type: constants.RESET_DATA_ALLOWANCE_STATE,
                payload: {},
            }), initialState)
        })
    })

    describe('GET_DATA_ALLOWANCE', () => {
        it('handles get request', () => {
            const expectedState = {
                ...initialState,
                gettingDataAllowance: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_DATA_ALLOWANCE_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles get success', () => {
            const allowance = '200000000000000000000'
            const expectedState = {
                ...initialState,
                dataAllowance: allowance,
                gettingDataAllowance: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_DATA_ALLOWANCE_SUCCESS,
                payload: {
                    dataAllowance: allowance,
                },
            }), expectedState)
        })

        it('handles get failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                gettingDataAllowance: false,
                getDataAllowanceError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_DATA_ALLOWANCE_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('SET_DATA_ALLOWANCE', () => {
        it('handles set allowance request', () => {
            const allowance = '200000000000000000000'
            const expectedState = {
                ...initialState,
                settingDataAllowance: true,
                pendingDataAllowance: allowance,
                setDataAllowanceTx: null,
                setDataAllowanceError: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_DATA_ALLOWANCE_REQUEST,
                payload: {
                    dataAllowance: allowance,
                },
            }), expectedState)
        })

        it('handles set allowance success', () => {
            const expectedState = {
                ...initialState,
                settingDataAllowance: false,
                pendingDataAllowance: null,
                dataAllowance: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_DATA_ALLOWANCE_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles set allowance success when transaction has started', () => {
            const state = {
                ...initialState,
                settingDataAllowance: true,
                pendingDataAllowance: '1234',
            }
            const expectedState = {
                ...initialState,
                settingDataAllowance: false,
                pendingDataAllowance: null,
                dataAllowance: '1234',
            }

            assert.deepStrictEqual(reducer(state, {
                type: constants.SET_DATA_ALLOWANCE_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles set allowance hash', () => {
            const hash = 'test'

            const expectedState = {
                ...initialState,
                setDataAllowanceTx: hash,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.RECEIVE_SET_DATA_ALLOWANCE_HASH,
                payload: {
                    hash,
                },
            }), expectedState)
        })

        it('handles set allowance error', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                settingDataAllowance: false,
                setDataAllowanceError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_DATA_ALLOWANCE_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    describe('RESET_DATA_ALLOWANCE', () => {
        it('handles reset allowance request when not setting allowance', () => {
            const expectedState = {
                ...initialState,
                settingDataAllowance: false,
                resettingDataAllowance: true,
                pendingDataAllowance: BN(0),
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.RESET_DATA_ALLOWANCE_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles reset allowance success when setting allowance', () => {
            const state = {
                ...initialState,
                settingDataAllowance: true,
                resettingDataAllowance: true,
                pendingDataAllowance: '12333',
                dataAllowance: '10',
            }
            const expectedState = {
                ...state,
                resettingDataAllowance: false,
                dataAllowance: '10',
                pendingDataAllowance: '12333',
                resetDataAllowanceError: null,
            }

            assert.deepStrictEqual(reducer(state, {
                type: constants.RESET_DATA_ALLOWANCE_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles reset allowance success when transaction has started and setting allowance', () => {
            const state = {
                ...initialState,
                settingDataAllowance: false,
                pendingDataAllowance: '1234',
            }
            const expectedState = {
                ...initialState,
                resettingDataAllowance: false,
                pendingDataAllowance: null,
                dataAllowance: '1234',
            }

            assert.deepStrictEqual(reducer(state, {
                type: constants.RESET_DATA_ALLOWANCE_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles reset allowance hash', () => {
            const hash = 'test'

            const expectedState = {
                ...initialState,
                resetDataAllowanceTx: hash,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.RECEIVE_RESET_DATA_ALLOWANCE_HASH,
                payload: {
                    hash,
                },
            }), expectedState)
        })

        it('handles reset allowance error', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                resettingDataAllowance: false,
                resetDataAllowanceError: error,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.RESET_DATA_ALLOWANCE_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })
})
