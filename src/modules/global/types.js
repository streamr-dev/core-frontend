// @flow

import type { ErrorInUi, NumberString, PayloadAction } from '../../flowtype/common-types'

export type DataPerUsdAction = PayloadAction<{
    dataPerUsd: number,
}>
export type DataPerUsdActionCreator = (NumberString) => DataPerUsdAction

export type GlobalEthereumErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type GlobalEthereumErrorActionCreator = (ErrorInUi) => GlobalEthereumErrorAction

export type IsMetaMaskInUseAction = PayloadAction<{
    isMetaMaskInUse: boolean,
}>
export type IsMetaMaskInUseActionCreator = (boolean) => IsMetaMaskInUseAction
