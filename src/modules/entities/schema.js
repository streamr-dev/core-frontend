// @flow
import { schema } from 'normalizr'

export const categorySchema = new schema.Entity('categories')
export const categoriesSchema = [categorySchema]

export const productSchema = new schema.Entity('products')
export const productsSchema = [productSchema]
