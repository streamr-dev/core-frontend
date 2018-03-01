// @flow

import React, { Component } from 'react'
import { Container, Row, Col } from '@streamr/streamr-layout'
import Holder from '../../Holder'
import classNames from 'classnames'
import styles from './styles.pcss'

export default class RelatedProducts extends Component<{}, {}> {
    render() {
        const relatedProducts = Array(4).fill(true) // it's whatever.

        return (
            <div className={classNames(styles.relatedProducts, 'product-page-section')}>
                <Container>
                    <h3>Related products</h3>
                    <Row>
                        {relatedProducts.map((whatever, index) => (
                            <Col key={index} xs={3}>
                                <div className="related-product">
                                    <Holder width="100p" height={180} text="Other product" theme="sky" />
                                    <strong>Product #{index + 1}</strong>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        )
    }
}
