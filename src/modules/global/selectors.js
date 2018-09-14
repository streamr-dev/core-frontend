// @flow

import { createSelector } from 'reselect'

import type { GlobalState, StoreState } from '../../flowtype/store-state'
import TransactionError from '../../errors/TransactionError'
import type { NumberString } from '../../flowtype/common-types'

const selectGlobalState = (state: StoreState): GlobalState => state.global

export const selectDataPerUsd: (StoreState) => ?NumberString = createSelector(
    selectGlobalState,
    (subState: GlobalState): ?NumberString => subState.dataPerUsd,
)

export const selectDataPerUsdError: (StoreState) => ?TransactionError = createSelector(
    selectGlobalState,
    (subState: GlobalState): ?TransactionError => subState.dataPerUsdRateError,
)

export const selectEthereumNetworkIsCorrect: (StoreState) => ?boolean = createSelector(
    selectGlobalState,
    (subState: GlobalState): ?boolean => subState.ethereumNetworkIsCorrect,
)

export const selectEthereumNetworkError: (StoreState) => ?TransactionError = createSelector(
    selectGlobalState,
    (subState: GlobalState): ?TransactionError => subState.ethereumNetworkError,
)

export const selectMetamaskPermission: (StoreState) => boolean = createSelector(
    selectGlobalState,
    (subState: GlobalState): ?boolean => subState.metamaskPermission,
)

export const selectIsWeb3Injected: (StoreState) => boolean = createSelector(
    selectGlobalState,
    (subState: GlobalState): boolean => (subState.isWeb3Injected != null ? subState.isWeb3Injected : false),
)
