// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'
import { isPaidProduct } from '../../../utils/product'
import type { Product } from '../../../flowtype/product-types'

import styles from './productDetails.pcss'

type Props = {
    product: Product,
    isValidSubscription: boolean,
    onPurchase: () => void,
}

const buttonTitle = (product: Product, isValidSubscription: boolean) => {
    if (isPaidProduct(product)) {
        return isValidSubscription ? 'Renew' : 'Purchase'
    }

    return `${isValidSubscription ? 'Added' : 'Add'} to my purchases`
}

const ProductDetails = ({ product, isValidSubscription, onPurchase }: Props) => (
    <div className={styles.details}>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <Button color="primary" disabled={product.pricePerSecond === 0 && isValidSubscription} onClick={onPurchase}>
            {buttonTitle(product, isValidSubscription)}
        </Button>
    </div>
)

export default ProductDetails
