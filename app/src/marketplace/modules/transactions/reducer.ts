import { handleActions } from 'redux-actions'
import { TransactionsState } from '../../types/store-state'
import { ADD_TRANSACTION, COMPLETE_TRANSACTION } from './constants'
import { TransactionIdAction } from './types'
export const initialState: TransactionsState = {
    pending: [],
    completed: [],
}
export type TransactionsActionPayloads = TransactionIdAction['payload'] | object
const reducer = handleActions<TransactionsState, TransactionsActionPayloads>(
    {
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
    },
    initialState,
)
export default reducer
