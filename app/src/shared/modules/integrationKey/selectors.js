// @flow

import { createSelector } from 'reselect'

import type { IntegrationKeyState, StoreState } from '$shared/flowtype/store-state'
import type { Web3AccountList } from '$shared/flowtype/web3-types'

const selectIntegrationKeyState = (state: StoreState): IntegrationKeyState => state.integrationKey

export const selectFetchingIntegrationKeys: (StoreState) => boolean = createSelector(
    selectIntegrationKeyState,
    (subState: IntegrationKeyState): boolean => subState.fetchingIntegrationKeys,
)

export const selectEthereumIdentities: (StoreState) => ?Web3AccountList = createSelector(
    selectIntegrationKeyState,
    (subState: IntegrationKeyState): ?Web3AccountList => subState.ethereumIdentities,
)

export const selectPrivateKeys: (StoreState) => ?Web3AccountList = createSelector(
    selectIntegrationKeyState,
    (subState: IntegrationKeyState): ?Web3AccountList => subState.privateKeys,
)
