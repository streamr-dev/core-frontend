// @flow

import { createSelector } from 'reselect'

import type { Web3State } from '$mp/flowtype/store-state'
import type { StoreState } from '$shared/flowtype/store-state'
import type { NumberString, ErrorInUi } from '$shared/flowtype/common-types'
import type { Address } from '$shared/flowtype/web3-types'

const selectWeb3State = (state: StoreState): Web3State => state.web3

export const selectAccountId: (StoreState) => ?Address = createSelector(
    selectWeb3State,
    (subState: Web3State): ?Address => subState.accountId,
)

export const selectAccountError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectWeb3State,
    (subState: Web3State): ?ErrorInUi => subState.error,
)

export const selectEnabled: (state: StoreState) => boolean = createSelector(
    selectWeb3State,
    (subState: Web3State): boolean => subState.enabled,
)

export const selectNetworkId: (StoreState) => NumberString = createSelector(
    selectWeb3State,
    (subState: Web3State): ?Address => subState.ethereumNetworkId,
)
