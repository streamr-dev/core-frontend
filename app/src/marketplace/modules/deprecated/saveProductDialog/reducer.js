// @flow

import { handleActions } from 'redux-actions'

import { saveProductSteps } from '$mp/utils/constants'
import type { SaveProductDialogState } from '$mp/flowtype/store-state'
import { UPDATE_CONTRACT_PRODUCT_SUCCESS } from '$mp/modules/updateContractProduct/constants'
import { PUT_PRODUCT_SUCCESS } from '../editProduct/constants'

import { SET_STEP, INIT_SAVE_DIALOG } from './constants'
import type { StepAction } from './types'

export const initialState: SaveProductDialogState = {
    step: saveProductSteps.STARTED,
    updateFinished: false,
}

export const reducer: (SaveProductDialogState) => SaveProductDialogState = handleActions({
    [INIT_SAVE_DIALOG]: (state: SaveProductDialogState) => ({
        ...state,
        step: saveProductSteps.STARTED,
        updateFinished: false,
    }),

    [SET_STEP]: (state: SaveProductDialogState, action: StepAction) => ({
        ...state,
        step: action.payload.step,
    }),

    // catch events from editProduct and updateContractProduct completion to know
    // when update has finished
    [UPDATE_CONTRACT_PRODUCT_SUCCESS]: (state: SaveProductDialogState) => ({
        ...state,
        updateFinished: true,
    }),

    [PUT_PRODUCT_SUCCESS]: (state: SaveProductDialogState) => ({
        ...state,
        updateFinished: state.step === saveProductSteps.SAVE,
    }),
}, initialState)

export default reducer
