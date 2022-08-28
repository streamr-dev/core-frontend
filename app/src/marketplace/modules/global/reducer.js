import { handleActions } from 'redux-actions'

import { SET_ETHEREUM_NETWORK_ID } from './constants'

export const initialState = {
    networkId: undefined,
}

const reducer = handleActions({
    [SET_ETHEREUM_NETWORK_ID]: (state, action) => ({
        ...state,
        networkId: action.payload.networkId,
    }),

}, initialState)

export default reducer
