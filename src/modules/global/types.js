// @flow

import type { ErrorInUi, PayloadAction } from '../../flowtype/common-types'

export type DataPerUsdAction = PayloadAction<{
    dataPerUsd: number,
}>
export type DataPerUsdActionCreator = (number) => DataPerUsdAction

export type GlobalEthereumErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type GlobalEthereumErrorActionCreator = (ErrorInUi) => GlobalEthereumErrorAction
