import type { PayloadAction } from '$shared/types/common-types'
import type { Balances } from '$shared/types/user-types'

export type SetBalanceAction = PayloadAction<{
    balances: Balances
}>
export type SetBalanceActionCreator = (arg0: Balances) => SetBalanceAction
