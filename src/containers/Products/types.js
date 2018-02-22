// @flow

import type {Category} from '../../flowtype/category-types.js'
import type {Stream} from '../../flowtype/stream-types.js'
import type {Currency, PayloadAction, ErrorInUi, ErrorFromApi} from '../../flowtype/common-types'

export type Product = {
    id: string,
    name: string,
    description: string,
    imageUrl: ?string,
    category: Category,
    state: 'new' | 'deploying' | 'deployed' | 'deleting' | 'deleted',
    tx: ?string,
    previewStream: ?Stream,
    previewConfigJson: ?string,
    dateCreated: Date,
    lastUpdated: Date,
    ownerAddress: string,
    beneficiaryAddress: string,
    pricePerSecond: number,
    priceCurrency: Currency,
    minimumSubscriptionInSeconds: number
}

export type ProductState = {
    byId: {
        [$ElementType<Product, 'id'>]: Product & {
            fetching?: ?boolean,
            error?: ?ErrorInUi
        }
    },
    fetching: boolean,
    error: ?ErrorInUi
}

export type ProductIdAction = PayloadAction<{
    id: $ElementType<Product, 'id'>,
}>

export type ProductsAction = PayloadAction<{
    products: Array<Product>,
}>

export type ProductAction = PayloadAction<{
    product: Product,
}>

export type ProductsErrorAction = PayloadAction<{
    error: ErrorFromApi
}>

export type ProductErrorAction = PayloadAction<{
    id: $ElementType<Product, 'id'>,
    error: ErrorFromApi
}>
