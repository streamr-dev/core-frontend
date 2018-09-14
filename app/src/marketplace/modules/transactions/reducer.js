// @flow

import { handleActions } from 'redux-actions'

import type { TransactionsState } from '../../flowtype/store-state'

import {
    ADD_TRANSACTION,
    COMPLETE_TRANSACTION,
} from './constants'
import type { TransactionIdAction } from './types'

export const initialState: TransactionsState = {
    pending: [],
    completed: [],
}

const reducer: (TransactionsState) => TransactionsState = handleActions({
    [ADD_TRANSACTION]: (state: TransactionsState, action: TransactionIdAction): TransactionsState => {
        const pending = new Set(state.pending)
        const completed = new Set(state.completed)

        pending.add(action.payload.id)
        completed.delete(action.payload.id)

        return {
            pending: [...pending],
            completed: [...completed],
        }
    },

    [COMPLETE_TRANSACTION]: (state: TransactionsState, action: TransactionIdAction) => {
        const pending = new Set(state.pending)
        const completed = new Set(state.completed)

        pending.delete(action.payload.id)
        completed.add(action.payload.id)

        return {
            pending: [...pending],
            completed: [...completed],
        }
    },
}, initialState)

export default reducer
