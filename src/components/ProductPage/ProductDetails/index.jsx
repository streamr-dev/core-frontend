// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'
import styles from './productDetails.pcss'
import type { Product } from '../../../flowtype/product-types'

type Props = {
    product: Product,
}

const ProductDetails = ({ product }: Props) => (
    <div className={styles.details}>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <Button color="primary">Get Streams</Button>
    </div>
)

export default ProductDetails
