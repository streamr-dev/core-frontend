// @flow

import type {CategoryId} from './category-types.js'
import type {StreamIdList, StreamId} from './stream-types.js'
import type {Currency} from './common-types'

export type ProductId = string

export type Product = {
    id: ProductId,
    state: 'NOT_DEPLOYED' | 'DEPLOYING' | 'DEPLOYED' | 'UNDEPLOYING',
    created: Date,
    updated: Date,
    name: string,
    description: string,
    imageUrl: ?string,
    category: CategoryId,
    streams: StreamIdList,
    previewStream: ?StreamId,
    previewConfigJson: ?string,
    ownerAddress: string,
    beneficiaryAddress: string,
    pricePerSecond: number,
    priceCurrency: Currency,
    minimumSubscriptionInSeconds: number,
}

export type ProductIdList = Array<ProductId>

export type ProductList = Array<Product>

export type ProductEntities = {
    [ProductId]: Product,
}
