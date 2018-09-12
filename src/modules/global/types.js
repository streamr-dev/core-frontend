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

export type MetamaskPermissionAction = PayloadAction<{
    metamaskPermission: boolean,
}>
export type MetamaskPermissionActionCreator = (boolean) => MetamaskPermissionAction
export type IsWeb3InjectedAction = PayloadAction<{
    isWeb3Injected: boolean,
}>
export type IsWeb3InjectedActionCreator = (boolean) => IsWeb3InjectedAction
