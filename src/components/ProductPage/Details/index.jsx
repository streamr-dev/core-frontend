// @flow

import React, { Component } from 'react'
import { Container, Row, Col } from '@streamr/streamr-layout'
import classNames from 'classnames'
import styles from './details.pcss'
import pageStyles from '../productPage.pcss'

import type { Stream, StreamList } from '../../../flowtype/stream-types'

export type Props = {
    streams: StreamList,
}

export default class Details extends Component<Props> {
    render() {
        const { streams } = this.props

        return (
            <div className={classNames(styles.details, pageStyles.section)}>
                <Container>
                    <div className={classNames(styles.streams)}>
                        <Row>
                            <Col xs={4}>
                                <div className={classNames(pageStyles.cell, pageStyles.headerCell)}>Streams ({streams.length || 0})</div>
                            </Col>
                            <Col xs={8}>
                                <div className={classNames(pageStyles.cell, pageStyles.headerCell)}>Description</div>
                            </Col>
                        </Row>
                        <hr />
                        {streams && streams.length > 0 && streams.filter((s) => !!s).map(({id, name, description}: Stream) => (
                            <Row key={id}>
                                <Col xs={4}>
                                    <div className={classNames(pageStyles.cell)}>{name}</div>
                                </Col>
                                <Col xs={8}>
                                    <div className={classNames(pageStyles.cell)}>{description}</div>
                                </Col>
                            </Row>
                        ))}
                    </div>
                </Container>
            </div>
        )
    }
}
