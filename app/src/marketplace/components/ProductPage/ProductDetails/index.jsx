// @flow

import React from 'react'
import cx from 'classnames'
import { Button } from 'reactstrap'
import { Translate } from 'react-redux-i18n'

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
    <div className={styles.root} ref={productDetailsRef}>
        <div className={styles.basics}>
            <h2 className={styles.title}>
                {product.name}
            </h2>
            <div className={styles.offer}>
                <span className={styles.productOwner}>by {product.owner}</span>
                <span className={styles.separator} />
                {product.isFree ? translate('productPage.productDetails.free') : (
                    <PaymentRate
                        className={styles.paymentRate}
                        amount={product.pricePerSecond}
                        currency={product.priceCurrency}
                        timeUnit={timeUnits.hour}
                    />
                )}
                {!!isValidSubscription && <div className={styles.activeTag}>Active</div>}
            </div>
        </div>
        <Button
            className={cx(styles.button, styles.paymentButton)}
            color="primary"
            disabled={(!isPaidProduct(product) && isValidSubscription) || product.state !== productStates.DEPLOYED}
            onClick={onPurchase}
        >
            {buttonTitle(product, isValidSubscription, translate)}
        </Button>
        <div
            className={cx(styles.description, {
                [styles.truncated]: !!truncateState,
            })}
        >
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
