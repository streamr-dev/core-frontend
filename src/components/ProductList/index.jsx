// @flow

import React from 'react'
import { Row, Container } from '@streamr/streamr-layout'
import type { Node } from 'react'
import classNames from 'classnames'

import styles from './productList.pcss'

type Props = {
    children: Node,
}

export default class ProductList extends React.Component<Props> {
    render() {
        return (
            <div className={classNames(styles.productList, 'product-list')}>
                <Container>
                    <Row>
                        {this.props.children}
                    </Row>
                </Container>
            </div>
        )
    }
}
