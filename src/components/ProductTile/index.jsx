// @flow

import React from 'react'
import { Link } from 'react-router-dom'

import { formatPath } from '../../utils/url'
import { formatPrice } from '../../utils/price'
import { productStates } from '../../utils/constants'
import links from '../../links'
import type { Product } from '../../flowtype/product-types'
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
        imageUrl,
        pricePerSecond,
        priceCurrency,
        state,
    } = source

    return (
        <Link to={formatPath(links.products, id || '')} className={styles.productTile}>
            {imageUrl ?
                <img src={imageUrl} alt="Product" />
                :
                <div className={styles.defaultImagePlaceholder}>
                    <Logo color="black" opacity="0.15" />
                </div>
            }
            <div className={styles.name}>{name}</div>
            {showOwner &&
                <div className={styles.owner}>{owner}</div>
            }
            {showPrice && state === productStates.DEPLOYED &&
                <div className={styles.price}>
                    {pricePerSecond === 0 ? 'Free' : formatPrice(pricePerSecond, priceCurrency, 0)}
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
