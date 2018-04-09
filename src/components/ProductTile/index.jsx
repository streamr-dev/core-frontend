// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { Col } from '@streamr/streamr-layout'
import { formatPath } from '../../utils/url'
import links from '../../links'
import styles from './productTile.pcss'
import { formatPrice } from '../../utils/price'
import { productStates } from '../../utils/constants'

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
