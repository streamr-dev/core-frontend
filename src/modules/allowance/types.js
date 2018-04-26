// @flow

import type { PayloadAction, ErrorInUi, NumberString } from '../../flowtype/common-types'
import type { Hash, Receipt } from '../../flowtype/web3-types'

export type AllowanceAction = PayloadAction<{
    allowance: NumberString,
}>
export type AllowanceActionCreator = (NumberString) => AllowanceAction

export type GetAllowanceErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type GetAllowanceErrorActionCreator = (ErrorInUi) => GetAllowanceErrorAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (Hash) => HashAction

export type ReceiptAction = PayloadAction<{
    receipt: Receipt,
}>
export type ReceiptActionCreator = (Receipt) => ReceiptAction

export type SetAllowanceErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type SetAllowanceErrorActionCreator = (ErrorInUi) => SetAllowanceErrorAction
