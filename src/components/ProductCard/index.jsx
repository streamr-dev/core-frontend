// @flow

import React from 'react'
import { Link } from 'react-router-dom'

import type { Product as ProductCardProps } from '../../flowtype/product-types'

export const ProductCard = ({ id, name }: ProductCardProps) => (
    <div>
        <Link to={`/products/${id ? id : ''}`}>Product {id}: {name}</Link>
    </div>
)

export default ProductCard
