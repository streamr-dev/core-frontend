// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { Col } from '@streamr/streamr-layout'
import classNames from 'classnames'
import { formatPath } from '../../utils/url'
import links from '../../links'

import styles from './product.pcss'

type Props = {
    id: string,
    name: string,
}

export default class Product extends React.Component<Props, {}> {
    render() {
        return (
            <Col xs={3}>
                <Link to={formatPath(links.products, this.props.id)} className={classNames(styles.product, 'product-list-item')}>
                    {this.props.name}
                </Link>
            </Col>
        )
    }
}
