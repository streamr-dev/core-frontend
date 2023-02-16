import { handleActions } from 'redux-actions'
import type { UserState } from '$shared/types/store-state'
import type { SetBalanceAction } from './types'
import {
    SET_BALANCE,
} from './constants'
export const initialState: UserState = {
    balances: {}
}
export type UserStateActionPayloads = SetBalanceAction['payload'] | object
const reducer = handleActions<UserState, UserStateActionPayloads>(
    {
        [SET_BALANCE]: (state: UserState, action: SetBalanceAction) => ({
            ...state,
            balances: {
                ...state.balances,
                // $FlowFixMe balances is an object
                ...action.payload.balances,
            },
        }),
    },
    {
        ...initialState,
    },
)
export default reducer
