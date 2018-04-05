// @flow

import React from 'react'
import { Container, Row, Col } from '@streamr/streamr-layout'
import Holder from '../../Holder'
import styles from './relatedProducts.pcss'
import pageStyles from '../productPage.pcss'

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

export default RelatedProducts
