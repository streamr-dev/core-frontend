// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'
import styles from './ProductDetailsEditor.pcss'
import type { Product } from '../../../flowtype/product-types'

type Props = {
    product: Product,
    openPriceDialog: () => void,
}

const ProductDetailsEditor = ({ product, openPriceDialog }: Props) => (
    <div className={styles.details}>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <Button color="primary">Get Streams</Button>
        <Button color="primary" onClick={openPriceDialog}>Set price</Button>
    </div>
)

export default ProductDetailsEditor
