import { createAction } from 'redux-actions'
import { contractProductSchema } from '$shared/modules/entities/schema'
import { ErrorInUi, ReduxActionCreator } from '$shared/types/common-types'
import { handleEntities } from '$shared/utils/entities'
import { Address } from '$shared/types/web3-types'
import { ProjectId } from '../../types/project-types'
import {
    GET_PRODUCT_FROM_CONTRACT_FAILURE,
    GET_PRODUCT_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_FROM_CONTRACT_SUCCESS,
    SET_WHITELISTED_ADDRESSES,
    ADD_WHITELISTED_ADDRESS,
    REMOVE_WHITELISTED_ADDRESS,
    CLEAR_CONTRACT_PRODUCT,
} from './constants'
import * as services from './services'
import { ProductIdActionCreator, ProductErrorActionCreator, WhiteListedAddressActionCreator, WhiteListedAddressesActionCreator } from './types'
const getProductFromContractRequest: ProductIdActionCreator = createAction(GET_PRODUCT_FROM_CONTRACT_REQUEST, (id: ProjectId) => ({
    id,
}))
const getProductFromContractSuccess: ProductIdActionCreator = createAction(GET_PRODUCT_FROM_CONTRACT_SUCCESS, (id: ProjectId) => ({
    id,
}))
const getProductFromContractFailure: ProductErrorActionCreator = createAction(
    GET_PRODUCT_FROM_CONTRACT_FAILURE,
    (id: ProjectId, error: ErrorInUi) => ({
        id,
        error,
    }),
)
export const setWhiteListedAddresses: WhiteListedAddressesActionCreator = createAction(
    SET_WHITELISTED_ADDRESSES,
    (id: ProjectId, addresses: Array<Address>) => ({
        id,
        addresses,
    }),
)
export const addWhiteListedAddress: WhiteListedAddressActionCreator = createAction(ADD_WHITELISTED_ADDRESS, (id: ProjectId, address: Address) => ({
    id,
    address,
}))
export const removeWhiteListedAddress: WhiteListedAddressActionCreator = createAction(
    REMOVE_WHITELISTED_ADDRESS,
    (id: ProjectId, address: Address) => ({
        id,
        address,
    }),
)
export const getProductFromContract = (id: ProjectId, chainId: number) => (dispatch: (...args: Array<any>) => any) => {
    dispatch(getProductFromContractRequest(id))
    return services
        .getProductFromContract(id, true, chainId)
        .then((data) =>
            handleEntities(
                contractProductSchema,
                dispatch,
            )({
                id,
                ...data,
            }),
        )
        .then(
            (result) => {
                dispatch(getProductFromContractSuccess(result))
            },
            (error) => {
                dispatch(
                    getProductFromContractFailure(id, {
                        message: error.message,
                    }),
                )
            },
        )
}
export const clearContractProduct: ReduxActionCreator = createAction(CLEAR_CONTRACT_PRODUCT)
