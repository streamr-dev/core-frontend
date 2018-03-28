// @flow

import { createSelector } from 'reselect'

import type { Web3State, StoreState } from '../../flowtype/store-state'
import type { Address } from '../../flowtype/web3-types'

const selectWeb3State = (state: StoreState): Web3State => state.web3

export const selectAccount: (StoreState) => ?Address = createSelector(
    selectWeb3State,
    (subState: Web3State): ?Address => subState.account
)

