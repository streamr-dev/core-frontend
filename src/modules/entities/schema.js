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
