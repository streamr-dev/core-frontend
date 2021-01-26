// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { selectEntities } from '$shared/modules/entities/selectors'
import type { ContractProductState, StoreState } from '../../flowtype/store-state'
import type { EntitiesState } from '$shared/flowtype/store-state'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { ProductId, SmartContractProduct, WhitelistedAddress } from '$mp/flowtype/product-types'
import { contractProductSchema, whiteListedAddressesSchema } from '$shared/modules/entities/schema'
import type { Address } from '$shared/flowtype/web3-types'

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

export const selectWhiteListedAddressIds: (StoreState) => Array<Address> = createSelector(
    selectContractProductState,
    (subState: ContractProductState): Array<Address> => subState.whitelistedAddresses,
)

export const selectWhiteListedAddresses: (StoreState) => Array<WhitelistedAddress> = createSelector(
    selectWhiteListedAddressIds,
    selectEntities,
    (ids: Array<Address>, entities: EntitiesState): Array<WhitelistedAddress> => denormalize(ids, whiteListedAddressesSchema, entities),
)
