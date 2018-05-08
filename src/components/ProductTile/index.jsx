// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { formatPath } from '../../utils/url'
import { productStates, timeUnits } from '../../utils/constants'
import PaymentRate from '../PaymentRate'
import links from '../../links'
import type { Product } from '../../flowtype/product-types'
import { isPaidProduct } from '../../utils/product'
import { Logo } from './Logo'

import styles from './productTile.pcss'

export type Props = {
    source: Product,
    showOwner?: boolean,
    showPrice?: boolean,
    showSubscriptionStatus?: boolean,
    showPublishStatus?: boolean,
}

const ProductTile = ({
    source,
    showOwner,
    showPrice,
    showSubscriptionStatus,
    showPublishStatus,
}: Props) => {
    const {
        id,
        name,
        owner,
        thumbnailUrl,
        pricePerSecond,
        priceCurrency,
        state,
    } = source

    return (
        <Link to={formatPath(links.products, id || '')} className={styles.productTile}>
            {thumbnailUrl ?
                <img src={thumbnailUrl} alt="Product" />
                :
                <div className={styles.defaultImagePlaceholder}>
                    <Logo color="black" opacity="0.15" />
                    <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII="
                        alt="Product"
                    />
                </div>
            }
            <div className={styles.name}>{name}</div>
            {showOwner &&
                <div className={styles.owner}>{owner}</div>
            }
            {showPrice && state === productStates.DEPLOYED &&
                <div className={styles.price}>
                    {(!isPaidProduct(source) && 'Free') || (
                        <PaymentRate
                            amount={pricePerSecond}
                            currency={priceCurrency}
                            timeUnit={timeUnits.hour}
                            maxDigits={4}
                        />
                    )}
                </div>
            }
            {showSubscriptionStatus &&
                <div className={styles.subscriptionStatus}>Active</div>
            }
            {showPublishStatus && state === productStates.DEPLOYED &&
                <span className={styles.publishStatus}>Published</span>
            }
            {showPublishStatus && state !== productStates.DEPLOYED &&
                <span className={styles.publishStatus}>Draft</span>
            }
        </Link>
    )
}

ProductTile.defaultProps = {
    showOwner: true,
    showPrice: true,
    showSubscriptionStatus: true,
    showPublishStatus: true,
}

export default ProductTile
