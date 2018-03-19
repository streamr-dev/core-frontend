// @flow

import { createAction } from 'redux-actions'
import {
    GET_CONTRACT_PRODUCT_BY_ID_REQUEST,
    GET_CONTRACT_PRODUCT_BY_ID_SUCCESS,
    GET_CONTRACT_PRODUCT_BY_ID_FAILURE,
} from './constants'
import * as services from './services'
import type { ContractProductId, ContractProductError } from '../../flowtype/web3-types'
import type { ContractProductIdActionCreator, ContractProductErrorActionCreator } from './types'
import { contractProductSchema } from '../entities/schema'
import { normalize } from 'normalizr'
import { updateEntities } from '../entities/actions'

export const getContractProductByIdRequest: ContractProductIdActionCreator = createAction(
    GET_CONTRACT_PRODUCT_BY_ID_REQUEST,
    (id: ContractProductId) => ({
        id,
    })
)

export const getContractProductByIdSuccess: ContractProductIdActionCreator = createAction(
    GET_CONTRACT_PRODUCT_BY_ID_SUCCESS,
    (id: ContractProductId) => ({
        id,
    })
)

export const getContractProductByIdFailure: ContractProductErrorActionCreator = createAction(
    GET_CONTRACT_PRODUCT_BY_ID_FAILURE,
    (id: ContractProductId, error: ContractProductError) => ({
        id,
        error,
    })
)

export const getContractProductById = (id: ContractProductId) => (dispatch: Function) => {
    dispatch(getContractProductByIdRequest(id))
    return services
        .getContractProductById(id)
        .then(data => {
            const { result, entities } = normalize(data, contractProductSchema)

            dispatch(updateEntities(entities))
            dispatch(getContractProductByIdSuccess(result))
        })
        .catch(error => {
            dispatch(getContractProductByIdFailure(id, error))
        })
}
