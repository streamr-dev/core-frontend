import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import { selectEntities } from '$shared/modules/entities/selectors'
import { EntitiesState } from '$shared/types/store-state'
import { ErrorInUi } from '$shared/types/common-types'
import { ProjectId, SmartContractProduct, WhitelistedAddress } from '$mp/types/project-types'
import { contractProductSchema, whiteListedAddressesSchema } from '$shared/modules/entities/schema'
import { Address } from '$shared/types/web3-types'
import { ContractProductState, StoreState } from '../../types/store-state'

const selectContractProductState = (state: StoreState): ContractProductState => state.contractProduct

export const selectFetchingContractProduct: (arg0: StoreState) => boolean = createSelector(
    selectContractProductState,
    (subState: ContractProductState): boolean => subState.fetchingContractProduct,
)
export const selectContractProductError: (arg0: StoreState) => ErrorInUi | null | undefined = createSelector(
    selectContractProductState,
    (subState: ContractProductState): ErrorInUi | null | undefined => subState.contractProductError,
)
export const selectContractProductId: (arg0: StoreState) => ProjectId | null | undefined = createSelector(
    selectContractProductState,
    (subState: ContractProductState): ProjectId | null | undefined => subState.id,
)
export const selectContractProduct: (arg0: StoreState) => SmartContractProduct | null | undefined = createSelector(
    selectContractProductId,
    selectEntities,
    (id: ProjectId, entities: EntitiesState): SmartContractProduct | null | undefined => denormalize(id, contractProductSchema, entities),
)
export const selectWhiteListedAddressIds: (arg0: StoreState) => Array<Address> = createSelector(
    selectContractProductState,
    (subState: ContractProductState): Array<Address> => subState.whitelistedAddresses,
)
export const selectWhiteListedAddresses: (arg0: StoreState) => Array<WhitelistedAddress> = createSelector(
    selectWhiteListedAddressIds,
    selectEntities,
    (ids: Array<Address>, entities: EntitiesState): Array<WhitelistedAddress> => denormalize(ids, whiteListedAddressesSchema, entities),
)
