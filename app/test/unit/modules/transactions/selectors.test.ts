import { normalize } from 'normalizr'
import * as all from '$mp/modules/transactions/selectors'
import { transactionsSchema } from '$shared/modules/entities/schema'
import { StoreState } from '$shared/types/store-state'
const transactions = [
    {
        id: '12345',
        type: 'purchase',
        state: 'pending',
    },
    {
        id: 'abcdef',
        type: 'dataAllowance',
        state: 'completed',
    },
]
const normalized = normalize(transactions, transactionsSchema)
const state: Partial<StoreState> = {
    transactions: {
        pending: ['12345'],
        completed: ['abcdef'],
    },
    entities: normalized.entities,
}
describe('transactions - selectors', () => {
    it('selects pending transaction ids', () => {
        expect(all.selectPendingTransactionIds(state as StoreState)).toStrictEqual(state.transactions.pending)
    })
    it('selects completed transaction ids', () => {
        expect(all.selectCompletedTransactionIds(state as StoreState)).toStrictEqual(state.transactions.completed)
    })
    it('selects the transaction entity', () => {
        const selector = all.makeSelectTransaction('12345')
        expect(selector(state as StoreState)).toStrictEqual(transactions[0])
    })
})
