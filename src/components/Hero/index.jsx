// @flow

import React from 'react'
import type { Node } from 'react'
import { Container, Row, Col } from '@streamr/streamr-layout'
import classNames from 'classnames'

import styles from './hero.pcss'

type Props = {
    leftContent: Node,
    rightContent: Node,
}

const Hero = ({ leftContent, rightContent }: Props) => (
    <div className={classNames(styles.hero, styles.section)}>
        <Container>
            <Row>
                <Col xs={12} md={5}>
                    {leftContent}
                </Col>
                <Col xs={12} md={7}>
                    {rightContent}
                </Col>
            </Row>
        </Container>
    </div>
)

export default Hero
