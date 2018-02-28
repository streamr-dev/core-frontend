// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { Col } from '@streamr/streamr-layout'
import classNames from 'classnames'
import { formatPath } from '../../utils/url'
import links from '../../links'
import styles from './styles.pcss'
import Holder from '../Holder'

import type { Product } from '../../flowtype/product-types'

type Props = {
    source: Product,
}

export default class ProductTile extends React.Component<Props, {}> {
    render() {
        const { id, name, description, pricePerSecond, priceCurrency } = this.props.source

        return (
            <Col xs={3}>
                <Link to={formatPath(links.products, id)} className={classNames(styles.productTile, 'product-tile')}>
                    <Holder width="100p" height="100" text={name} />
                    <strong>{name}</strong>
                    <div>{description}</div>
                    <div>{pricePerSecond}{priceCurrency}</div>
                </Link>
            </Col>
        )
    }
}
