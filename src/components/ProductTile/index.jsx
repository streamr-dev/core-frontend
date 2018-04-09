// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { Col } from '@streamr/streamr-layout'
import { formatPath } from '../../utils/url'
import links from '../../links'
import styles from './productTile.pcss'
import { formatPrice } from '../../utils/price'

import type { Product } from '../../flowtype/product-types'

type Props = {
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
        <Col xs={3}>
            <Link to={formatPath(links.products, id || '')} className={styles.productTile}>
                <img src={imageUrl} alt="Product" />
                <span className={styles.name}>{name}</span>
                { showOwner &&
                    <span className={styles.owner}>{owner}</span>
                }
                { showPrice && state === 'DEPLOYED' &&
                    <span className={styles.price}>
                        { pricePerSecond === 0 ? 'Free' : formatPrice(pricePerSecond, priceCurrency, 0) }
                    </span>
                }
                { showSubscriptionStatus &&
                    <span className={styles.subscriptionStatus}>active</span>
                }
                { showPublishStatus && state === 'DEPLOYED' &&
                    <span className={styles.publishStatus}>Published</span>
                }
                { showPublishStatus && state !== 'DEPLOYED' &&
                    <span className={styles.publishStatus}>Draft</span>
                }
            </Link>
        </Col>
    )
}

ProductTile.defaultProps = {
    showOwner: true,
    showPrice: true,
    showSubscriptionStatus: true,
    showPublishStatus: true,
}

export default ProductTile
