// @flow

import React, { type Node } from 'react'
import { Col, Row } from 'reactstrap'

import styles from './tocSection.pcss'

type Props = {
    id: string,
    title: string,
    linkTitle?: string,
    children?: Node,
}

export const TOCSection = ({ id, title, children }: Props) => (
    <div id={id} className={styles.section}>
        <Row>
            <Col xs={12}>
                <h3 className={styles.title}>{title}</h3>
            </Col>
        </Row>
        <Row>
            <Col xs={12} sm={8}>
                {children}
            </Col>
        </Row>
    </div>
)

export default TOCSection
