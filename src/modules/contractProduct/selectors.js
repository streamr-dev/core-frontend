// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import type { ContractProduct, ContractProductId, ContractProductError } from '../../flowtype/web3-types'
import type { StoreState, ContractProductState, EntitiesState } from '../../flowtype/store-state'
import { selectEntities } from '../entities/selectors'
import { contractProductSchema } from '../entities/schema'

const selectContractProductState = (state: StoreState): ContractProductState => state.contractProduct

export const selectContractProductId: (state: StoreState) => ?ContractProductId = createSelector(
    selectContractProductState,
    (subState: ContractProductState): ?ContractProductId => subState.id
)

export const selectContractProduct: (state: StoreState) => ?ContractProduct = createSelector(
    selectContractProductId,
    selectEntities,
    (id: ?ContractProductId, entities: EntitiesState): ?ContractProduct => denormalize(id, contractProductSchema, entities)
)

export const selectContractProductFetching: (state: StoreState) => boolean = createSelector(
    selectContractProductState,
    (subState: ContractProductState): boolean => subState.fetching
)

export const selectContractProductError: (state: StoreState) => ?ContractProductError = createSelector(
    selectContractProductState,
    (subState: ContractProductState): ?ContractProductError => subState.error
)
