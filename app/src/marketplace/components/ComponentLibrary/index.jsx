// @flow

import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import Toggle from '../../../shared/components/Toggle'

import styles from './componentLibrary.pcss'

const ComponentLibrary = () => (
    <Container>
        <Row>
            <Col xs="2">
                <span className={styles.title}>Toggle</span>
            </Col>
            <Col>
                <Toggle />
            </Col>
        </Row>
    </Container>
)

export default ComponentLibrary
