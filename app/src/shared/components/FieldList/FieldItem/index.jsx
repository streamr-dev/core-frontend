// @flow

import React from 'react'
import { Row, Col } from 'reactstrap'

import styles from './fieldItem.pcss'

type Props = {
    name: string,
}

const FieldItem = ({ name }: Props) => (
    <div
        className={styles.root}
    >
        <div
            className={styles.inner}
        >
            <Row>
                <Col xs="7">
                    <input type="text" placeholder="Field name" defaultValue={name} />
                </Col>
                <Col xs="5">
                    <select />
                </Col>
            </Row>
        </div>
    </div>
)

FieldItem.styles = styles

export default FieldItem
