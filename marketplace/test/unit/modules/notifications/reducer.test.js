import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/modules/notifications/reducer'
import * as constants from '../../../../src/modules/notifications/constants'

describe('notifications - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    it('handles show', () => {
        const expectedState1 = {
            notifications: [
                {
                    id: 1,
                    title: 'Test 1',
                },
            ],
        }

        let newState = reducer(undefined, {
            type: constants.SHOW_NOTIFICATION,
            payload: {
                id: 1,
                title: 'Test 1',
            },
        })
        assert.deepStrictEqual(newState, expectedState1)

        const expectedState2 = {
            notifications: [
                {
                    id: 2,
                    title: 'Test 2',
                },
                {
                    id: 1,
                    title: 'Test 1',
                },
            ],
        }

        newState = reducer(newState, {
            type: constants.SHOW_NOTIFICATION,
            payload: {
                id: 2,
                title: 'Test 2',
            },
        })
        assert.deepStrictEqual(newState, expectedState2)
    })

    it('handles hide', () => {
        const expectedState1 = {
            notifications: [
                {
                    id: 1,
                    title: 'Test 1',
                },
            ],
        }

        let newState = reducer(undefined, {
            type: constants.SHOW_NOTIFICATION,
            payload: {
                id: 1,
                title: 'Test 1',
            },
        })
        assert.deepStrictEqual(newState, expectedState1)

        const expectedState2 = {
            notifications: [],
        }

        newState = reducer(newState, {
            type: constants.HIDE_NOTIFICATION,
            payload: {
                id: 1,
            },
        })
        assert.deepStrictEqual(newState, expectedState2)
    })
})
