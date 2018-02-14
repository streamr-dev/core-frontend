// @flow

import type {Category} from './category-types.js'
import type {Stream} from './stream-types.js'
import type {Currency} from './common-types'

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
