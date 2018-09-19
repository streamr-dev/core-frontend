// @flow

import { denormalize } from 'normalizr'
import { createSelector } from 'reselect'

import type { EntitiesState, StoreState } from '../../flowtype/store-state'
import type { Hash, TransactionEntity } from '../../flowtype/web3-types'

import { transactionSchema } from './schema'

export const selectEntities = (state: StoreState): EntitiesState => state.entities

export const makeSelectTransaction = (txHash: Hash) => createSelector(
    selectEntities,
    (entities: EntitiesState): ?TransactionEntity => denormalize(txHash, transactionSchema, entities),
)
