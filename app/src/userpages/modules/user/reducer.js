// @flow

import type { UserState } from '../../flowtype/states/user-state'
import type { UserAction } from '../../flowtype/actions/user-actions'

import {
    SAVE_CURRENT_USER_REQUEST,
    SAVE_CURRENT_USER_SUCCESS,
    SAVE_CURRENT_USER_FAILURE,
    UPDATE_CURRENT_USER,
} from './actions'

const initialState = {
    currentUser: null,
    error: null,
    fetching: false,
    saved: true,
}

export default function (state: UserState = initialState, action: UserAction): UserState {
    switch (action.type) {
        case SAVE_CURRENT_USER_REQUEST:
            return {
                ...state,
                fetching: true,
            }
        case SAVE_CURRENT_USER_SUCCESS:
            return {
                ...state,
                currentUser: action.user,
                fetching: false,
                saved: true,
                error: null,
            }
        case SAVE_CURRENT_USER_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error,
            }
        case UPDATE_CURRENT_USER:
            return {
                ...state,
                saved: false,
                currentUser: {
                    ...(state.currentUser || {}),
                    ...action.user,
                },
            }
        default:
            return state
    }
}
