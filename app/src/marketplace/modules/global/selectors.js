import { createSelector } from 'reselect'

const selectGlobalState = (state) => state.global

export const selectEthereumNetworkId = createSelector(
    selectGlobalState,
    (subState) => subState.networkId,
)
