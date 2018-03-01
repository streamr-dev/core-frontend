// @flow

import React, { Component } from 'react'
import { Container, Row, Col, Button } from '@streamr/streamr-layout'
import Holder from '../../Holder'
import classNames from 'classnames'
import styles from './styles.pcss'

import type { Product } from '../../../flowtype/product-types'

type Props = {
    product: Product,
}

export default class Hero extends Component<Props> {
    render() {
        const { product } = this.props

        return (
            <div className={classNames(styles.hero, 'product-page-section')}>
                <Container>
                    <Row>
                        <Col xs={5}>
                            <Holder width="100p" height={400} text="Preview" />
                        </Col>
                        <Col xs={7}>
                            <div className={styles.details}>
                                <h2>{product.name}</h2>
                                <p>{product.description}</p>
                                <Button color="primary">Get Streams</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
