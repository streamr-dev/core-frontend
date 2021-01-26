// @flow

import { handleActions } from 'redux-actions'

import type { ContractProductState } from '../../flowtype/store-state'

import {
    GET_PRODUCT_FROM_CONTRACT_FAILURE,
    GET_PRODUCT_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_FROM_CONTRACT_SUCCESS,
    CLEAR_CONTRACT_PRODUCT,
    SET_WHITELISTED_ADDRESSES,
    ADD_WHITELISTED_ADDRESS,
    REMOVE_WHITELISTED_ADDRESS,
} from './constants'
import type {
    ProductIdAction,
    ProductErrorAction,
    WhiteListedAddressAction,
    WhiteListedAddressesAction,
} from './types'

export const initialState: ContractProductState = {
    id: null,
    fetchingContractProduct: false,
    contractProductError: null,
    whitelistedAddresses: [],
}

const reducer: (ContractProductState) => ContractProductState = handleActions({
    [GET_PRODUCT_FROM_CONTRACT_REQUEST]: (state: ContractProductState, action: ProductIdAction) => ({
        ...state,
        id: action.payload.id,
        fetchingContractProduct: true,
        contractProductError: null,
    }),

    [GET_PRODUCT_FROM_CONTRACT_SUCCESS]: (state: ContractProductState, action: ProductIdAction) => ({
        ...state,
        id: action.payload.id,
        fetchingContractProduct: false,
    }),

    [GET_PRODUCT_FROM_CONTRACT_FAILURE]: (state: ContractProductState, action: ProductErrorAction) => ({
        ...state,
        id: null,
        fetchingContractProduct: false,
        contractProductError: action.payload.error,
    }),

    [CLEAR_CONTRACT_PRODUCT]: (state: ContractProductState) => ({
        ...state,
        id: null,
        fetchingContractProduct: false,
        contractProductError: null,
    }),

    [SET_WHITELISTED_ADDRESSES]: (state: ContractProductState, action: WhiteListedAddressesAction) => {
        const nextAddresses = new Set(action.payload.addresses)

        return {
            ...state,
            whitelistedAddresses: [...nextAddresses],
        }
    },

    [ADD_WHITELISTED_ADDRESS]: (state: ContractProductState, action: WhiteListedAddressAction) => {
        const nextAddresses = new Set([...state.whitelistedAddresses, action.payload.address])

        return {
            ...state,
            whitelistedAddresses: [...nextAddresses],
        }
    },

    [REMOVE_WHITELISTED_ADDRESS]: (state: ContractProductState, action: WhiteListedAddressAction) => {
        const nextAddresses = new Set(state.whitelistedAddresses)
        nextAddresses.delete(action.payload.address)

        return {
            ...state,
            whitelistedAddresses: [...nextAddresses],
        }
    },
}, initialState)

export default reducer
