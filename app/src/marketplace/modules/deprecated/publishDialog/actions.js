// @flow

import { createAction } from 'redux-actions'

import { deployFreeProduct, redeployProduct } from '$mp/modules/publish/actions'
import { undeployFreeProduct, deleteProduct } from '$mp/modules/unpublish/actions'
import type { ProductId } from '$mp/flowtype/product-types'
import type { StoreState, PublishStep } from '$mp/flowtype/store-state'
import { publishFlowSteps } from '$mp/utils/constants'
import { selectContractProduct } from '$mp/modules/contractProduct/selectors'
import { createContractProduct } from '$mp/modules/createContractProduct/actions'
import { isPaidProduct } from '$mp/utils/product'
import { selectProduct } from './selectors'
import {
    INIT_PUBLISH,
    SET_STEP,
} from './constants'
import type { StepActionCreator, ProductIdActionCreator } from './types'

export const initPublish: ProductIdActionCreator = createAction(
    INIT_PUBLISH,
    (id: ProductId) => ({
        id,
    }),
)

const setStep: StepActionCreator = createAction(
    SET_STEP,
    (step: PublishStep) => ({
        step,
    }),
)

export const publishOrCreateProduct = () => (dispatch: Function, getState: () => StoreState) => {
    const state = getState()
    const product = selectProduct(state)

    if (product) {
        if (isPaidProduct(product)) {
            const contractProduct = selectContractProduct(state)

            // If product doesn't exist, we need to create it first
            if (!contractProduct && product.id) {
                dispatch(createContractProduct(product.id, {
                    id: product.id,
                    name: product.name,
                    ownerAddress: product.ownerAddress,
                    beneficiaryAddress: product.beneficiaryAddress,
                    pricePerSecond: product.pricePerSecond,
                    priceCurrency: product.priceCurrency,
                    minimumSubscriptionInSeconds: product.minimumSubscriptionInSeconds,
                    state: product.state,
                }))
                dispatch(setStep(publishFlowSteps.CREATE_CONTRACT_PRODUCT))
            } else {
                dispatch(redeployProduct(product.id || ''))
                dispatch(setStep(publishFlowSteps.PUBLISH_CONTRACT_PRODUCT))
            }
        } else {
            dispatch(deployFreeProduct(product.id || ''))
            dispatch(setStep(publishFlowSteps.PUBLISH_FREE_PRODUCT))
        }
    }
}

export const unpublishProduct = () => (dispatch: Function, getState: () => StoreState) => {
    const product = selectProduct(getState())

    if (product) {
        if (isPaidProduct(product)) {
            dispatch(deleteProduct(product.id || ''))
            dispatch(setStep(publishFlowSteps.UNPUBLISH_CONTRACT_PRODUCT))
        } else {
            dispatch(undeployFreeProduct(product.id || ''))
            dispatch(setStep(publishFlowSteps.UNPUBLISH_FREE_PRODUCT))
        }
    }
}
