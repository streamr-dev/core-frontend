import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import { selectEntities } from '$shared/modules/entities/selectors'
import type { EntitiesState } from '$shared/flowtype/store-state'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { ProductId, SmartContractProduct, WhitelistedAddress } from '$mp/flowtype/product-types'
import { contractProductSchema, whiteListedAddressesSchema } from '$shared/modules/entities/schema'
import type { Address } from '$shared/flowtype/web3-types'
import type { ContractProductState, StoreState } from '../../flowtype/store-state'

const selectContractProductState = (state: StoreState): ContractProductState => state.contractProduct

export const selectFetchingContractProduct: (arg0: StoreState) => boolean = createSelector(
    selectContractProductState,
    (subState: ContractProductState): boolean => subState.fetchingContractProduct,
)
export const selectContractProductError: (arg0: StoreState) => ErrorInUi | null | undefined = createSelector(
    selectContractProductState,
    (subState: ContractProductState): ErrorInUi | null | undefined => subState.contractProductError,
)
export const selectContractProductId: (arg0: StoreState) => ProductId | null | undefined = createSelector(
    selectContractProductState,
    (subState: ContractProductState): ProductId | null | undefined => subState.id,
)
export const selectContractProduct: (arg0: StoreState) => SmartContractProduct | null | undefined = createSelector(
    selectContractProductId,
    selectEntities,
    (id: ProductId, entities: EntitiesState): SmartContractProduct | null | undefined =>
        denormalize(id, contractProductSchema, entities),
)
export const selectWhiteListedAddressIds: (arg0: StoreState) => Array<Address> = createSelector(
    selectContractProductState,
    (subState: ContractProductState): Array<Address> => subState.whitelistedAddresses,
)
export const selectWhiteListedAddresses: (arg0: StoreState) => Array<WhitelistedAddress> = createSelector(
    selectWhiteListedAddressIds,
    selectEntities,
    (ids: Array<Address>, entities: EntitiesState): Array<WhitelistedAddress> =>
        denormalize(ids, whiteListedAddressesSchema, entities),
)
