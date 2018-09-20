// @flow

import React from 'react'
import classNames from 'classnames'
import { Button } from 'reactstrap'
import { Translate } from '@streamr/streamr-layout'

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
    setTruncateState: () => void,
    truncateState: boolean,
    truncationRequired: boolean,
    productDetailsRef: Object,
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

const ProductDetails = ({
    product,
    isValidSubscription,
    onPurchase,
    translate,
    truncateState,
    setTruncateState,
    truncationRequired,
    productDetailsRef,
}: Props) => (
    <div className={styles.details} ref={productDetailsRef}>
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
        <div>
            <Button
                className={classNames(styles.button, styles.paymentButton)}
                color="primary"
                disabled={(!isPaidProduct(product) && isValidSubscription) || product.state !== productStates.DEPLOYED}
                onClick={onPurchase}
            >
                {buttonTitle(product, isValidSubscription, translate)}
            </Button>
        </div>
        <div className={classNames(styles.description, truncateState && styles.truncated)}>
            {product.description}
            {!!truncationRequired && (
                <Button color="special" className={styles.readMoreLess} onClick={setTruncateState}>
                    <Translate value={truncateState ? 'productPage.description.more' : 'productPage.description.less'} />
                </Button>
            )}
        </div>
    </div>
)

export default withI18n(ProductDetails)
