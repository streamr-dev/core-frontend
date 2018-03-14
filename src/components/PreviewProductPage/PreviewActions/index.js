// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from '@streamr/streamr-layout'

import styles from './previewactions.pcss'
import links from '../../../links.json'

export type Props = {
    onPublish: () => void,
    onSave: () => void,
}

const PreviewActions = ({ onPublish, onSave }: Props) => (
    <div className={styles.previewActions}>
        <Container>
            <Row>
                <Col xs={6}>
                    <Button tag={Link} to={links.createProduct}>Edit product</Button>
                </Col>
                <Col xs={6} className={styles.saveButtons}>
                    <Button onClick={(e: SyntheticInputEvent<EventTarget>) => onSave()}>Save</Button>
                    <Button onClick={(e: SyntheticInputEvent<EventTarget>) => onPublish()}>Publish</Button>
                </Col>
            </Row>
        </Container>
    </div>
)

export default PreviewActions
