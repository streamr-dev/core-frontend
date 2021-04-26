// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { IntegrationKeyState, StoreState, EntitiesState } from '$shared/flowtype/store-state'
import type { IntegrationKeyIdList, IntegrationKeyList, BalanceList } from '$shared/flowtype/integration-key-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { integrationKeysSchema } from '$shared/modules/entities/schema'

const selectIntegrationKeyState = (state: StoreState): IntegrationKeyState => state.integrationKey

export const selectFetchingIntegrationKeys: (StoreState) => boolean = createSelector(
    selectIntegrationKeyState,
    (subState: IntegrationKeyState): boolean => subState.fetchingIntegrationKeys,
)

export const selectEthereumIdentityIds: (StoreState) => IntegrationKeyIdList = createSelector(
    selectIntegrationKeyState,
    (subState: IntegrationKeyState): ?IntegrationKeyIdList => subState.ethereumIdentities,
)

export const selectEthereumIdentities: (StoreState) => ?IntegrationKeyList = createSelector(
    selectEthereumIdentityIds,
    selectEntities,
    (result: ?IntegrationKeyList, entities: EntitiesState): IntegrationKeyList => denormalize(result, integrationKeysSchema, entities),
)

export const selectIntegrationKeysError: (StoreState) => ?ErrorInUi = createSelector(
    selectIntegrationKeyState,
    (subState: IntegrationKeyState): ?ErrorInUi => subState.integrationKeysError,
)

export const selectCreatingIdentity: (StoreState) => boolean = createSelector(
    selectIntegrationKeyState,
    (subState: IntegrationKeyState): boolean => subState.creatingIdentity,
)

export const selectCreatingIdentityError: (StoreState) => ?ErrorInUi = createSelector(
    selectIntegrationKeyState,
    (subState: IntegrationKeyState): ?ErrorInUi => subState.creatingIdentityError,
)

export const selectBalances: (StoreState) => BalanceList = createSelector(
    selectIntegrationKeyState,
    selectEthereumIdentities,
    (subState: IntegrationKeyState, ethIdentities: IntegrationKeyList): BalanceList => {
        const uniqueAccounts = [...(new Set([
            ...(ethIdentities || []).map(({ json }) => json.address).filter(Boolean),
        ]))]

        return uniqueAccounts.reduce((result, address) => {
            if (!subState.balances[address]) {
                return result
            }

            return ({
                ...result,
                [address]: subState.balances[address],
            })
        }, {})
    },
)
