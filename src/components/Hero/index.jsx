// @flow

import React, { Component } from 'react'
import { Container, Row, Col } from '@streamr/streamr-layout'
import classNames from 'classnames'
import styles from './hero.pcss'
import type { Node } from 'react'

type Props = {
    leftContent: Node,
    rightContent: Node,
}

export default class Hero extends Component<Props> {
    render() {
        const { leftContent, rightContent } = this.props

        return (
            <div className={classNames(styles.hero, styles.section)}>
                <Container>
                    <Row>
                        <Col xs={5}>
                            {leftContent}
                        </Col>
                        <Col xs={7}>
                            {rightContent}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
