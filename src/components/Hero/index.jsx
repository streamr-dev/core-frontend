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
        <Container className={styles.heroContainer}>
            <Row className={styles.heroRow}>
                <Col xs={12} md={5} className={styles.heroColumn}>
                    {leftContent}
                </Col>
                <Col xs={12} md={7} className={styles.heroColumn}>
                    {rightContent}
                </Col>
            </Row>
        </Container>
    </div>
)

export default Hero
