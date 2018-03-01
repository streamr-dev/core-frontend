// @flow

import React, { Component } from 'react'
import { Container, Row, Col } from '@streamr/streamr-layout'
import classNames from 'classnames'
import styles from './styles.pcss'

export default class Details extends Component<{}> {
    render() {
        return (
            <div className={classNames(styles.details, 'product-page-section')}>
                <Container>
                    <div className={classNames(styles.streams)}>
                        <Row>
                            <Col xs={4}>
                                <div className="cell header-cell">Streams (1)</div>
                            </Col>
                            <Col xs={8}>
                                <div className="cell header-cell">Description</div>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col xs={4}>
                                <div className="cell">All trams on Metro Helsinki lines</div>
                            </Col>
                            <Col xs={8}>
                                <div className="cell">6 data points, updates every 100 MS.</div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        )
    }
}
