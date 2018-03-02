// @flow

import type {Category} from './category-types.js'
import type {Stream} from './stream-types.js'
import type {Currency} from './common-types'

export type Product = {
    id: string,
    state: 'NOT_DEPLOYED' | 'DEPLOYING' | 'DEPLOYED' | 'UNDEPLOYING',
    created: Date,
    updated: Date,
    name: string,
    description: string,
    imageUrl: ?string,
    category: $ElementType<Category, 'id'>,
    streams: Array<$ElementType<Stream, 'id'>>,
    previewStream: ?$ElementType<Stream, 'id'>,
    previewConfigJson: ?string,
    ownerAddress: string,
    beneficiaryAddress: string,
    pricePerSecond: number,
    priceCurrency: Currency,
    minimumSubscriptionInSeconds: number,
}

export type ProductId = $ElementType<Product, 'id'>

export type ProductIdList = Array<ProductId>

export type ProductList = Array<Product>

export type ProductEntities = {
    [ProductId]: Product,
}
