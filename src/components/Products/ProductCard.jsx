// @flow

import React from 'react'
import { Link } from 'react-router-dom'

import type {Product} from '../../flowtype/product-types'

export type ProductCardProps = Product

export const ProductCard = ({ id, name }: ProductCardProps) => (
    <div>
        <Link to={`/products/${id}`}>Product {id}: {name}</Link>
    </div>
)

export default ProductCard
