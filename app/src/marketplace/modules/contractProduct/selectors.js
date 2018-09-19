// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { selectEntities } from '../entities/selectors'
import type { ContractProductState, StoreState, EntitiesState } from '../../flowtype/store-state'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { ProductId, SmartContractProduct } from '../../flowtype/product-types'
import { contractProductSchema } from '../entities/schema'

const selectContractProductState = (state: StoreState): ContractProductState => state.contractProduct

export const selectFetchingContractProduct: (StoreState) => boolean = createSelector(
    selectContractProductState,
    (subState: ContractProductState): boolean => subState.fetchingContractProduct,
)

export const selectContractProductError: (StoreState) => ?ErrorInUi = createSelector(
    selectContractProductState,
    (subState: ContractProductState): ?ErrorInUi => subState.contractProductError,
)

export const selectContractProductId: (StoreState) => ?ProductId = createSelector(
    selectContractProductState,
    (subState: ContractProductState): ?ProductId => subState.id,
)

export const selectContractProduct: (StoreState) => ?SmartContractProduct = createSelector(
    selectContractProductId,
    selectEntities,
    (id: ProductId, entities: EntitiesState): ?SmartContractProduct => denormalize(id, contractProductSchema, entities),
)
