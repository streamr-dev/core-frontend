// @flow

import React from 'react'
import cx from 'classnames'
import { Button } from 'reactstrap'
import { I18n } from 'react-redux-i18n'

import { isPaidProduct } from '$mp/utils/product'
import type { Product } from '$mp/flowtype/product-types'
import PaymentRate from '$mp/components/PaymentRate'
import { timeUnits, productStates } from '$shared/utils/constants'
import Link from '$shared/components/Link'

import styles from './productDetails2.pcss'

type Props = {
    product: Product,
    isValidSubscription: boolean,
    onPurchase: () => void,
}

const buttonTitle = (product: Product, isValidSubscription: boolean) => {
    if (isPaidProduct(product)) {
        return isValidSubscription ?
            I18n.t('productPage.productDetails.renew') :
            I18n.t('productPage.productDetails.purchase')
    }

    return isValidSubscription ?
        I18n.t('productPage.productDetails.saved') :
        I18n.t('productPage.productDetails.add')
}

const ProductDetails = ({ product, isValidSubscription, onPurchase }: Props) => (
    <div className={styles.root}>
        <div
            className={cx(styles.basics, {
                [styles.active]: !!isValidSubscription,
            })}
        >
            <h2 className={styles.title}>
                {product.name}
            </h2>
            <div className={styles.offer}>
                <div className={styles.paymentRate}>
                    {product.isFree ? I18n.t('productPage.productDetails.free') : (
                        <React.Fragment>
                            <span className={styles.priceHeading}>Price</span>
                            &nbsp;
                            <PaymentRate
                                className={styles.price}
                                amount={product.pricePerSecond}
                                currency={product.priceCurrency}
                                timeUnit={timeUnits.hour}
                            />
                        </React.Fragment>
                    )}
                </div>
                <div className={styles.activeTag}>
                    <span>Active</span>
                </div>
            </div>
        </div>
        <div className={styles.separator} />
        <div className={styles.buttonWrapper}>
            <Button
                className={styles.button}
                color="primary"
                disabled={(!isPaidProduct(product) && isValidSubscription) || product.state !== productStates.DEPLOYED}
                onClick={onPurchase}
            >
                {buttonTitle(product, isValidSubscription)}
            </Button>
        </div>
        <div className={styles.separator} />
        <div className={styles.details}>
            <div>
                <span className={styles.subheading}>Sold by</span>
                &nbsp;
                {product.owner}
            </div>
            <div>
                <span className={styles.subheading}>Website</span>
                &nbsp;
                TODO
            </div>
            <div>
                <Link href="#TODO">Contact seller</Link>
            </div>
            <div>
                <Link href="#TODO">View other products</Link>
            </div>
        </div>
    </div>
)

export default ProductDetails
