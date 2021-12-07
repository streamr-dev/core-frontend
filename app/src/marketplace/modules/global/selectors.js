import { createSelector } from 'reselect'

const selectGlobalState = (state) => state.global

export const selectDataPerUsd = createSelector(
    selectGlobalState,
    (subState) => subState.dataPerUsd,
)

export const selectDataPerUsdError = createSelector(
    selectGlobalState,
    (subState) => subState.dataPerUsdRateError,
)

export const selectEthereumNetworkId = createSelector(
    selectGlobalState,
    (subState) => subState.networkId,
)
