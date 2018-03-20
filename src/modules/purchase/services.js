// @flow

import type { ProductId } from '../../flowtype/product-types'
import { Transaction, buy } from '../../utils/web3'

export const buyProduct = (id: ProductId): Transaction => new Transaction(buy(id))
