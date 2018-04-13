// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'
import { Link } from 'react-router-dom'

import { formatPath } from '../../../utils/url'
import links from '../../../links'
import type { Product } from '../../../flowtype/product-types'

import styles from './productDetails.pcss'

type Props = {
    product: Product,
}

const ProductDetails = ({ product }: Props) => (
    <div className={styles.details}>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <Button color="primary" tag={Link} to={formatPath(links.products, product.id || '', 'purchase')}>Get Streams</Button>
    </div>
)

export default ProductDetails
