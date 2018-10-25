// @flow

import React from 'react'
import cx from 'classnames'
import { Button } from 'reactstrap'
import { Translate } from 'react-redux-i18n'

import Link from '$shared/components/Link'
import { isPaidProduct } from '$mp/utils/product'
import type { Product } from '$mp/flowtype/product-types'
import PaymentRate from '$mp/components/PaymentRate'
import { timeUnits, productStates } from '$shared/utils/constants'
import withI18n from '$mp/containers/WithI18n'

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
        <div
            className={cx(styles.basics, {
                [styles.active]: !!isValidSubscription,
            })}
        >
            <h2 className={styles.title}>
                {product.name}
            </h2>
            <div className={styles.offer}>
                <span className={styles.productOwner}>by {product.owner}</span>
                <span className={styles.separator} />
                <div className={styles.paymentRate}>
                    {product.isFree ? translate('productPage.productDetails.free') : (
                        <PaymentRate
                            amount={product.pricePerSecond}
                            currency={product.priceCurrency}
                            timeUnit={timeUnits.hour}
                        />
                    )}
                </div>
                <div className={styles.activeTag}>
                    <span>Active</span>
                </div>
            </div>
        </div>
        <div className={styles.buttonWrapper}>
            <Button
                className={styles.button}
                color="primary"
                disabled={(!isPaidProduct(product) && isValidSubscription) || product.state !== productStates.DEPLOYED}
                onClick={onPurchase}
            >
                {buttonTitle(product, isValidSubscription, translate)}
            </Button>
        </div>
        <div className={styles.description}>
            <div
                className={cx(styles.inner, {
                    [styles.truncated]: !!truncateState,
                })}
            >
                {product.description}
            </div>
            {!!truncationRequired && (
                <Link
                    decorated
                    href="#"
                    className={styles.toggleMore}
                    onClick={setTruncateState}
                >
                    {truncateState ? (
                        <Translate value="productPage.description.more" />
                    ) : (
                        <Translate value="productPage.description.less" />
                    )}
                </Link>
            )}
        </div>
    </div>
)

export default withI18n(ProductDetails)
