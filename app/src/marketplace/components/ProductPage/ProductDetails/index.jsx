// @flow

import React from 'react'
import cx from 'classnames'
import { I18n } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import { isPaidProduct } from '$mp/utils/product'
import type { Product, Subscription } from '$mp/flowtype/product-types'
import PaymentRate from '$mp/components/PaymentRate'
import ExpirationCounter from '$mp/components/ExpirationCounter'
import { timeUnits, productStates } from '$shared/utils/constants'

import SocialIcons from './SocialIcons'
import styles from './productDetails2.pcss'

type Props = {
    product: Product,
    isValidSubscription: boolean,
    productSubscription?: Subscription,
    onPurchase: () => void | Promise<void>,
    isPurchasing?: boolean,
    isWhitelisted?: ?boolean,
}

const buttonTitle = (product: Product, isValidSubscription: boolean, isWhitelisted: ?boolean) => {
    if (product.requiresWhitelist && isWhitelisted === false) {
        return 'Request access'
    }

    if (isPaidProduct(product)) {
        return isValidSubscription ?
            I18n.t('productPage.productDetails.renew') :
            I18n.t('productPage.productDetails.purchase')
    }

    return isValidSubscription ?
        I18n.t('productPage.productDetails.saved') :
        I18n.t('productPage.productDetails.add')
}

const ProductDetails = ({
    product,
    isValidSubscription,
    productSubscription,
    onPurchase,
    isPurchasing,
    isWhitelisted,
}: Props) => (
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
                {productSubscription != null && !!productSubscription.endTimestamp && (
                    <ExpirationCounter expiresAt={new Date(productSubscription.endTimestamp * 1000)} />
                )}
            </div>
        </div>
        <div className={cx(styles.separator, styles.titleSeparator)} />
        <div className={styles.purchaseWrapper}>
            <div className={styles.buttonWrapper}>
                <Button
                    className={styles.button}
                    kind="primary"
                    size="big"
                    disabled={isPurchasing || (!isPaidProduct(product) && isValidSubscription) || product.state !== productStates.DEPLOYED}
                    onClick={onPurchase}
                    waiting={isPurchasing}
                >
                    {buttonTitle(product, isValidSubscription, isWhitelisted)}
                </Button>
                {product.contact && (
                    <SocialIcons className={styles.socialIcons} contactDetails={product.contact} />
                )}
            </div>
            <div className={cx(styles.separator, styles.purchaseSeparator)} />
            <div className={styles.details}>
                <div>
                    <span className={styles.subheading}>Sold by</span>
                    &nbsp;
                    {product.owner}
                </div>
                {product.contact && product.contact.url && (
                    <div>
                        <span className={styles.subheading}>Website</span>
                        &nbsp;
                        <a href={product.contact.url} rel="noopener noreferrer" target="_blank">{product.contact.url}</a>
                    </div>
                )}
                {product.contact && product.contact.email && (
                    <div>
                        <a href={`mailto:${product.contact.email}`}>Contact seller</a>
                    </div>
                )}
                {/* Hide these until we have a place to read them from */}
                {false && (
                    <React.Fragment>
                        <div>
                            <a href="#TODO">View other products</a>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    </div>
)

export default ProductDetails
