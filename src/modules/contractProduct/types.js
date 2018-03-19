// @flow

import type { PayloadAction } from '../../flowtype/common-types'
import type { ContractProductId, ContractProductError } from '../../flowtype/web3-types'

export type ContractProductIdAction = PayloadAction<{
    id: ContractProductId,
}>
export type ContractProductIdActionCreator = (ContractProductId) => ContractProductIdAction

export type ContractProductErrorAction = PayloadAction<{
    id: ContractProductId,
    error: ContractProductError,
}>
export type ContractProductErrorActionCreator = (ContractProductId, ContractProductError) => ContractProductErrorAction
