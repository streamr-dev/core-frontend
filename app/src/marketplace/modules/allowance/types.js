// @flow

import type { NumberString, PayloadAction, ErrorInUi } from '$shared/flowtype/common-types'
import type { Hash } from '$shared/flowtype/web3-types'

export type DataAllowanceAction = PayloadAction<{
    dataAllowance: NumberString,
}>

export type DaiAllowanceAction = PayloadAction<{
    daiAllowance: NumberString,
}>

export type AllowanceActionCreator = (NumberString) => DataAllowanceAction

export type GetAllowanceErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type GetAllowanceErrorActionCreator = (ErrorInUi) => GetAllowanceErrorAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (Hash) => HashAction

export type SetAllowanceErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type SetAllowanceErrorActionCreator = (?ErrorInUi) => SetAllowanceErrorAction
