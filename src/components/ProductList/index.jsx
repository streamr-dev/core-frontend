// @flow

import React, { Component } from 'react'
import { Row, Container } from '@streamr/streamr-layout'
import type { Node } from 'react'
import styles from './productList.pcss'

type Props = {
    children: Node,
}

export default class ProductList extends Component<Props> {
    render() {
        return (
            <div className={styles.productList}>
                <Container>
                    <Row>
                        {this.props.children}
                    </Row>
                </Container>
            </div>
        )
    }
}
