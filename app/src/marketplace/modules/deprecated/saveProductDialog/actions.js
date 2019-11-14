// @flow

import { createAction } from 'redux-actions'

import type { SaveProductStep, StoreState } from '$mp/flowtype/store-state'
import type { ReduxActionCreator } from '$shared/flowtype/common-types'
import { saveProductSteps } from '$mp/utils/constants'
import { selectContractProduct } from '$mp/modules/contractProduct/selectors'
import { selectEditProduct } from '$mp/modules/deprecated/editProduct/selectors'
import { isUpdateContractProductRequired } from '$mp/utils/smartContract'
import { updateProduct, resetUpdateProductTransaction } from '$mp/modules/deprecated/editProduct/actions'
import { updateContractProduct, resetUpdateContractProductTransaction } from '$mp/modules/updateContractProduct/actions'

import { SET_STEP, INIT_SAVE_DIALOG } from './constants'
import type { StepActionCreator } from './types'

const initSaveDialog: ReduxActionCreator = createAction(INIT_SAVE_DIALOG)

export const setStep: StepActionCreator = createAction(
    SET_STEP,
    (step: SaveProductStep) => ({
        step,
    }),
)

export const resetSaveDialog = () => (dispatch: Function) => {
    dispatch(initSaveDialog())
    dispatch(resetUpdateProductTransaction())
    dispatch(resetUpdateContractProductTransaction())
}

export const saveProduct = () => (dispatch: Function, getState: () => StoreState) => {
    dispatch(setStep(saveProductSteps.STARTED))

    const contractProduct = selectContractProduct(getState())
    const editProduct = selectEditProduct(getState())
    const doContractUpdate = !!contractProduct && isUpdateContractProductRequired(contractProduct, editProduct)

    dispatch(updateProduct(!doContractUpdate))

    if (doContractUpdate) {
        dispatch(setStep(saveProductSteps.TRANSACTION))

        dispatch(updateContractProduct(editProduct.id || '', {
            ...contractProduct,
            pricePerSecond: editProduct.pricePerSecond,
            beneficiaryAddress: editProduct.beneficiaryAddress,
            priceCurrency: editProduct.priceCurrency,
        }))
    } else {
        dispatch(setStep(saveProductSteps.SAVE))
    }
}
