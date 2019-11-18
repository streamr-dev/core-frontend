// @flow

import type { NumberString, ErrorInUi, PayloadAction } from '$shared/flowtype/common-types'

export type DataPerUsdAction = PayloadAction<{
    dataPerUsd: number,
}>
export type DataPerUsdActionCreator = (NumberString) => DataPerUsdAction

export type GlobalEthereumErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type GlobalEthereumErrorActionCreator = (ErrorInUi) => GlobalEthereumErrorAction
