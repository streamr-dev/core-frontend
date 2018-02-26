// @flow

import React from 'react'
import { Col } from '@streamr/streamr-layout'
import classNames from 'classnames'

import styles from './product.pcss'

type Props = {
    name: string,
}

export default class Product extends React.Component<Props, {}> {
    render() {
        return (
            <Col xs={3}>
                <div className={classNames(styles.product, 'product-list-item')}>
                    {this.props.name}
                </div>
            </Col>
        )
    }
}
