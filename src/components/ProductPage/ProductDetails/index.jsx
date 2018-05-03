// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'
import { isPaidProduct } from '../../../utils/product'
import type { Product } from '../../../flowtype/product-types'
import PaymentRate from '../../PaymentRate'
import { timeUnits } from '../../../utils/constants'

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
        <div className={styles.section}>
            <span>By {product.owner}</span>
            <span className={styles.separator}>|</span>
            <span>{product.isFree ? 'Free' : <PaymentRate
                className={styles.paymentRate}
                amount={product.pricePerSecond}
                currency={product.priceCurrency}
                timeUnit={timeUnits.hour}
                maxDigits={4}
            />}
            </span>
            {!!isValidSubscription && <div className={styles.activeTag}>Active</div>}
        </div>
        <p>{product.description}</p>
        <Button color="primary" disabled={isPaidProduct(product) && isValidSubscription} onClick={onPurchase}>
            {buttonTitle(product, isValidSubscription)}
        </Button>
    </div>
)

export default ProductDetails
