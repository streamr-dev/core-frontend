import { createAction } from 'redux-actions'
import { ErrorInUi } from '$shared/types/common-types'
import { getMyPurchases } from '../myPurchaseList/actions'
import { ProjectId, Subscription } from '../../types/project-types'
import {
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
} from './constants'
import * as services from './services'
import { ProductIdActionCreator, ProductErrorActionCreator, ProductSubscriptionActionCreator } from './types'
const getProductSubscriptionFromContractRequest: ProductIdActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
    (id: ProjectId) => ({
        id,
    }),
)
const getProductSubscriptionFromContractSuccess: ProductSubscriptionActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
    (id: ProjectId, subscription: Subscription) => ({
        id,
        subscription,
    }),
)
const getProductSubscriptionFromContractFailure: ProductErrorActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
    (id: ProjectId, error: ErrorInUi) => ({
        id,
        error,
    }),
)
export const getProductSubscription = (id: ProjectId, chainId: number) => (dispatch: (...args: Array<any>) => any): Promise<void> => {
    dispatch(getProductSubscriptionFromContractRequest(id))
    return dispatch(getMyPurchases()).then(() =>
        services.getMyProductSubscription(id, chainId).then(
            (result) => dispatch(getProductSubscriptionFromContractSuccess(id, result)),
            (error) =>
                dispatch(
                    getProductSubscriptionFromContractFailure(id, {
                        message: error.message,
                    }),
                ),
        ),
    )
}
