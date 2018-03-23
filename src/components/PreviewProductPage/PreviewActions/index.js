// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from '@streamr/streamr-layout'

import styles from './previewactions.pcss'
import links from '../../../links'

export type Props = {
    onSave: () => void,
}

const PreviewActions = ({ onSave }: Props) => (
    <div className={styles.previewActions}>
        <Container>
            <Row>
                <Col xs={6}>
                    <Button tag={Link} to={links.createProduct}>Edit product</Button>
                </Col>
                <Col xs={6} className={styles.saveButtons}>
                    <Button onClick={() => onSave()} color="primary">Save</Button>
                </Col>
            </Row>
        </Container>
    </div>
)

export default PreviewActions
