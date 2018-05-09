// @flow

import React from 'react'
import { Container, Row, Col } from '@streamr/streamr-layout'

import pageStyles from '../productPage.pcss'

import styles from './relatedProducts.pcss'

const RelatedProducts = () => {
    const relatedProducts = Array(4).fill(true) // it's whatever.

    return (
        <div className={pageStyles.section}>
            <Container>
                <h3>Related products</h3>
                <Row>
                    {relatedProducts.map((whatever, index) => (
                        <Col key={JSON.stringify(index)} xs={3}>
                            <div className={styles.product}>
                                <div
                                    style={{
                                        width: '100p',
                                        height: 180,
                                    }}
                                >
                                    Other product
                                </div>
                                <strong>Product #{index + 1}</strong>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    )
}

export default RelatedProducts
