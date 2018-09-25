// @flow

import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import Toggle from '../../../shared/components/Toggle'
import TextInput from '../../../shared/components/TextInput'

import styles from './componentLibrary.pcss'

const ComponentLibrary = () => (
    <Container className={styles.container}>
        <Row>
            <Col xs="2">
                <span className={styles.title}>Toggle</span>
            </Col>
            <Col>
                <Toggle />
            </Col>
        </Row>
        <Row>
            <Col xs="2">
                <span className={styles.title}>TextInput</span>
            </Col>
            <Col>
                <TextInput label="Name of this field" />
            </Col>
        </Row>
    </Container>
)

export default ComponentLibrary
