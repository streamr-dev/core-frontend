// @flow

import { createSelector } from 'reselect'

import type { Web3State, StoreState } from '../../flowtype/store-state'
import type { ErrorInUi, NumberString } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'

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
