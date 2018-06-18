import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/modules/modals/reducer'
import * as constants from '../../../../src/modules/modals/constants'

describe('modals - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    it('handles show', () => {
        const expectedState = {
            modalName: 'TEST_MODAL',
            modalProps: {
                number: 1337,
            },
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.SHOW_MODAL_DIALOG,
            payload: {
                modalName: 'TEST_MODAL',
                modalProps: {
                    number: 1337,
                },
            },
        }), expectedState)
    })

    it('handles hide', () => {
        const expectedState = {
            modalName: null,
            modalProps: null,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.HIDE_MODAL_DIALOG,
            payload: 'TEST_MODAL',
        }), expectedState)
    })
})
