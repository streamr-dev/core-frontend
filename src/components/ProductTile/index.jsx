// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { Col } from '@streamr/streamr-layout'
import { formatPath } from '../../utils/url'
import links from '../../links'
import styles from './productTile.pcss'
import Holder from '../Holder'

import type { Product } from '../../flowtype/product-types'

type Props = {
    source: Product,
}

const ProductTile = ({ source }: Props) => {
    const { id, name, pricePerSecond, priceCurrency } = source
    return (
        <Col xs={3}>
            <Link to={formatPath(links.products, id || '')} className={styles.productTile}>
                <Holder width="100p" height={100} text="Preview" />
                <strong>{name}</strong>
                <div>{pricePerSecond}{priceCurrency}</div>
            </Link>
        </Col>
    )
}

export default ProductTile
