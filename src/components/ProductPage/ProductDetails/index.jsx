// @flow

import React from 'react'
import BN from 'bignumber.js'
import { Button } from '@streamr/streamr-layout'

import type { Product } from '../../../flowtype/product-types'

import styles from './productDetails.pcss'

type Props = {
    product: Product,
    isValidSubscription: boolean,
    onPurchase: () => void,
}

const buttonTitle = (product: Product, isValidSubscription: boolean) => {
    if (BN(product.pricePerSecond).isGreaterThan(0)) {
        return isValidSubscription ? 'Renew' : 'Purchase'
    }

    return `${isValidSubscription ? 'Added' : 'Add'} to my purchases`
}

const ProductDetails = ({ product, isValidSubscription, onPurchase }: Props) => (
    <div className={styles.details}>
        <h2>{product.name}</h2>
        {!!isValidSubscription && <div className={styles.activeTag}>Active</div>}
        <p>{product.description}</p>
        <Button color="primary" disabled={BN(product.pricePerSecond).isEqualTo(0) && isValidSubscription} onClick={onPurchase}>
            {buttonTitle(product, isValidSubscription)}
        </Button>
    </div>
)

export default ProductDetails
