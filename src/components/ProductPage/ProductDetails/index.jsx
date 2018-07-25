// @flow

import React from 'react'
import classNames from 'classnames'
import { Button } from 'reactstrap'

import { isPaidProduct } from '../../../utils/product'
import type { Product } from '../../../flowtype/product-types'
import PaymentRate from '../../PaymentRate'
import { timeUnits, productStates } from '../../../utils/constants'
import withI18n from '../../../containers/WithI18n'

import styles from './productDetails.pcss'

type Props = {
    product: Product,
    isValidSubscription: boolean,
    onPurchase: () => void,
    translate: (key: string, options: any) => string,
}

const buttonTitle = (product: Product, isValidSubscription: boolean, translate: (key: string, options: any) => string) => {
    if (isPaidProduct(product)) {
        return isValidSubscription ?
            translate('productPage.productDetails.renew') :
            translate('productPage.productDetails.purchase')
    }

    return isValidSubscription ?
        translate('productPage.productDetails.saved') :
        translate('productPage.productDetails.add')
}

const ProductDetails = ({ product, isValidSubscription, onPurchase, translate }: Props) => (
    <div className={styles.details}>
        <h2 className={styles.title}>{product.name}</h2>
        <div className={styles.section}>
            <span className={styles.productOwner}>by {product.owner}</span>
            <span className={styles.separator}>|</span>
            <span>{product.isFree ? translate('productPage.productDetails.free') : <PaymentRate
                className={styles.paymentRate}
                amount={product.pricePerSecond}
                currency={product.priceCurrency}
                timeUnit={timeUnits.hour}
            />}
            </span>
            {!!isValidSubscription && <div className={styles.activeTag}>Active</div>}
        </div>
        <div className={styles.description}>{product.description}</div>
        <div>
            <Button
                className={classNames(styles.button, 'hidden-xs-down')}
                color="primary"
                disabled={(!isPaidProduct(product) && isValidSubscription) || product.state !== productStates.DEPLOYED}
                onClick={onPurchase}
            >
                {buttonTitle(product, isValidSubscription, translate)}
            </Button>
        </div>
    </div>
)

export default withI18n(ProductDetails)
