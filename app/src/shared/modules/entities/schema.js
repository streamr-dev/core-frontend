// @flow

import { schema } from 'normalizr'

export const categorySchema = new schema.Entity('categories')
export const categoriesSchema = [categorySchema]

export const productSchema = new schema.Entity('products')
export const productsSchema = [productSchema]

export const contractProductSchema = new schema.Entity('contractProducts')
export const contractProductsSchema = [contractProductSchema]

export const streamSchema = new schema.Entity('streams')
export const streamsSchema = [streamSchema]

export const subscriptionSchema = new schema.Entity(
    'subscriptions',
    {
        product: productSchema,
    },
    {
        idAttribute: (value) => value.product.id,
    },
)
export const subscriptionsSchema = [subscriptionSchema]

export const transactionSchema = new schema.Entity('transactions')
export const transactionsSchema = [transactionSchema]

export const dashboardSchema = new schema.Entity('dashboards')
export const dashboardsSchema = [dashboardSchema]

export const canvasSchema = new schema.Entity('canvases')
export const canvasesSchema = [canvasSchema]

export const integrationKeySchema = new schema.Entity('integrationKeys')
export const integrationKeysSchema = [integrationKeySchema]

export const resourceKeySchema = new schema.Entity('resourceKeys')
export const resourceKeysSchema = [resourceKeySchema]

export const communityProductSchema = new schema.Entity('communityProducts')
export const communityProductsSchema = [communityProductSchema]

export const joinRequestSchema = new schema.Entity('joinRequests')
export const joinRequestsSchema = [joinRequestSchema]
