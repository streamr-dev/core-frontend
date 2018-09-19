import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/modules/publishDialog/reducer'
import * as constants from '../../../../src/modules/publishDialog/constants'
import * as globalConstants from '../../../../src/utils/constants'

describe('publishDialog - reducer', () => {
    it('has initial state', () => {
        assert.deepEqual(reducer(undefined, {}), initialState)
    })

    it('handles INIT_PUBLISH', () => {
        const id = 'test'
        const expectedState = {
            ...initialState,
            productId: id,
            step: globalConstants.publishFlowSteps.CONFIRM,
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.INIT_PUBLISH,
            payload: {
                id,
            },
        }), expectedState)
    })

    it('handles SET_STEP', () => {
        const step = 'CUSTOM'
        const expectedState = {
            ...initialState,
            step,
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.SET_STEP,
            payload: {
                step,
            },
        }), expectedState)
    })
})
