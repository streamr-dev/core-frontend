// @flow

import * as React from 'react'
import { Container, Row, Col } from 'reactstrap'

import styles from './hero.pcss'

type Props = {
    leftContent: React.Node,
    rightContent: React.Node,
}

const Hero = ({ leftContent, rightContent }: Props) => (
    <div className={styles.hero}>
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
