// @flow

import React, { type Node } from 'react'
import { Col, Row } from 'reactstrap'
import ScrollableAnchor from 'react-scrollable-anchor'

import styles from './tocSection.pcss'

type Props = {
    id: string,
    title: string,
    linkTitle?: string,
    children?: Node,
}

export const TOCSection = ({ id, title, children }: Props) => (
    <ScrollableAnchor id={id}>
        <div className={styles.section}>
            <Row>
                <Col xs={12}>
                    <h3 className={styles.title}>{title}</h3>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    {children}
                </Col>
            </Row>
        </div>
    </ScrollableAnchor>
)

export default TOCSection
