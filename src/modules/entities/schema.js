// @flow

import { schema } from 'normalizr'

export const categorySchema = new schema.Entity('categories')
export const categoriesSchema = [categorySchema]

export const productSchema = new schema.Entity('products')
export const productsSchema = [productSchema]

export const contractProductSchema = new schema.Entity('contractProducts')
export const contractProductsSchema = [contractProductSchema]

export const myProductSchema = new schema.Entity('myProducts')
export const myProductsSchema = [myProductSchema]

export const myPurchaseSchema = new schema.Entity('myPurchases')
export const myPurchasesSchema = [myPurchaseSchema]

export const relatedProductSchema = new schema.Entity('relatedProducts')
export const relatedProductsSchema = [relatedProductSchema]

export const streamSchema = new schema.Entity('streams')
export const streamsSchema = [streamSchema]
