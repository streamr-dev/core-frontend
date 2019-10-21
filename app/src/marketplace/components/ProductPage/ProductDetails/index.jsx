// @flow

import React, { useRef, useState, useCallback } from 'react'
import cx from 'classnames'
import { Button } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'

import Link from '$shared/components/Link'
import { isPaidProduct } from '$mp/utils/product'
import type { Product } from '$mp/flowtype/product-types'
import PaymentRate from '$mp/components/PaymentRate'
import { timeUnits, productStates } from '$shared/utils/constants'

import styles from './productDetails.pcss'

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

const ProductDetails = ({ product, isValidSubscription, onPurchase }: Props) => {
    const productDetailsRef = useRef(null)
    const truncationRequired = !((product.description || '').length < 400)
    const [truncated, setTruncatedState] = useState(truncationRequired)

    const setTruncated = useCallback(() => {
        setTruncatedState((prev) => !prev)

        if (productDetailsRef.current) {
            scrollIntoView(productDetailsRef.current, {
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            })
        }
    }, [setTruncatedState])

    return (
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
                        [styles.truncated]: !!truncated,
                    })}
                >
                    {product.description}
                </div>
                {!!truncationRequired && (
                    <Link
                        decorated
                        href="#"
                        className={styles.toggleMore}
                        onClick={setTruncated}
                    >
                        {truncated ? (
                            <Translate value="productPage.description.more" />
                        ) : (
                            <Translate value="productPage.description.less" />
                        )}
                    </Link>
                )}
            </div>
        </div>
    )
}

export default ProductDetails
