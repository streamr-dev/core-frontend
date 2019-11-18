import assert from 'assert-diff'

import { saveProductSteps } from '$mp/utils/constants'
import reducer, { initialState } from '$mp/modules/deprecated/saveProductDialog/reducer'
import * as constants from '$mp/modules/deprecated/saveProductDialog/constants'
import * as contractProductConstants from '$mp/modules/updateContractProduct/constants'
import * as editProductConstants from '$mp/modules/deprecated/editProduct/constants'

describe('saveProductDialog - reducers', () => {
    it('has initial state', async () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    it('handles INIT_SAVE_DIALOG', () => {
        const expectedState = {
            step: saveProductSteps.STARTED,
            updateFinished: false,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.INIT_SAVE_DIALOG,
        }), expectedState)
    })

    it('handles SET_STEP', () => {
        const expectedState = {
            step: saveProductSteps.SAVE,
            updateFinished: false,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.SET_STEP,
            payload: {
                step: saveProductSteps.SAVE,
            },
        }), expectedState)
    })

    it('handles UPDATE_CONTRACT_PRODUCT_SUCCESS', () => {
        const nextState = {
            ...initialState,
            step: saveProductSteps.TRANSACTION,
        }
        const expectedState = {
            step: saveProductSteps.TRANSACTION,
            updateFinished: true,
        }

        assert.deepStrictEqual(reducer(nextState, {
            type: contractProductConstants.UPDATE_CONTRACT_PRODUCT_SUCCESS,
        }), expectedState)
    })

    it('handles PUT_PRODUCT_SUCCESS when saving to API', () => {
        const nextState = {
            ...initialState,
            step: saveProductSteps.SAVE,
        }
        const expectedState = {
            step: saveProductSteps.SAVE,
            updateFinished: true,
        }

        assert.deepStrictEqual(reducer(nextState, {
            type: editProductConstants.PUT_PRODUCT_SUCCESS,
        }), expectedState)
    })

    it('handles PUT_PRODUCT_SUCCESS when saving to contract', () => {
        const nextState = {
            ...initialState,
            step: saveProductSteps.TRANSACTION,
        }
        const expectedState = {
            step: saveProductSteps.TRANSACTION,
            updateFinished: false,
        }

        assert.deepStrictEqual(reducer(nextState, {
            type: editProductConstants.PUT_PRODUCT_SUCCESS,
        }), expectedState)
    })
})
