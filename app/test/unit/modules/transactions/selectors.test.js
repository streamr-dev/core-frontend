import { normalize } from 'normalizr'

import * as all from '$mp/modules/transactions/selectors'
import { transactionsSchema } from '$shared/modules/entities/schema'

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

const state = {
    transactions: {
        pending: ['12345'],
        completed: ['abcdef'],
    },
    entities: normalized.entities,
}

describe('transactions - selectors', () => {
    it('selects pending transaction ids', () => {
        expect(all.selectPendingTransactionIds(state)).toStrictEqual(state.transactions.pending)
    })

    it('selects completed transaction ids', () => {
        expect(all.selectCompletedTransactionIds(state)).toStrictEqual(state.transactions.completed)
    })

    it('selects the transaction entity', () => {
        const selector = all.makeSelectTransaction('12345')
        expect(selector(state)).toStrictEqual(transactions[0])
    })
})
