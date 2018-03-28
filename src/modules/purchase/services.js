// @flow

import type { ProductId } from '../../flowtype/product-types'
import { buy } from '../../utils/web3'
import { Transaction } from '../utils/smartContract'

export const buyProduct = (id: ProductId): Transaction => new Transaction(buy(id))
