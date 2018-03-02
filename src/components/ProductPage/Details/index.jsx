// @flow

import React, { Component } from 'react'
import { Container, Row, Col } from '@streamr/streamr-layout'
import classNames from 'classnames'
import styles from './details.pcss'
import pageStyles from '../productPage.pcss'

export default class Details extends Component<{}> {
    render() {
        return (
            <div className={classNames(styles.details, pageStyles.section)}>
                <Container>
                    <div className={classNames(styles.streams)}>
                        <Row>
                            <Col xs={4}>
                                <div className={classNames(pageStyles.cell, pageStyles.headerCell)}>Streams (1)</div>
                            </Col>
                            <Col xs={8}>
                                <div className={classNames(pageStyles.cell, pageStyles.headerCell)}>Description</div>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col xs={4}>
                                <div className={classNames(pageStyles.cell)}>All trams on Metro Helsinki lines</div>
                            </Col>
                            <Col xs={8}>
                                <div className={classNames(pageStyles.cell)}>6 data points, updates every 100 MS.</div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        )
    }
}
