// @flow

import React from 'react'
import cx from 'classnames'
import { Button } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'

import Link from '$shared/components/Link'
import { isPaidProduct } from '../../../utils/product'
import type { Product } from '../../../flowtype/product-types'
import PaymentRate from '../../PaymentRate'
import { timeUnits, productStates } from '../../../utils/constants'

import styles from './productDetails.pcss'

type Props = {
    product: Product,
    isValidSubscription: boolean,
    onPurchase: () => void,
    setTruncateState: () => void,
    truncateState: boolean,
    truncationRequired: boolean,
    productDetailsRef: Object,
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

const ProductDetails = ({
    product,
    isValidSubscription,
    onPurchase,
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
                    {product.isFree ? I18n.t('productPage.productDetails.free') : (
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
                {buttonTitle(product, isValidSubscription)}
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

export default ProductDetails
