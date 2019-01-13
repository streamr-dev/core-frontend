// @flow

import React from 'react'
import { Container, Row, Col } from 'reactstrap'

// $FlowFixMe
import ContentMDX from './ContentMDX.mdx'
import Layout from '$mp/components/Layout'

import styles from './gettingStartedPage.pcss'

const GettingStartedPage = () => (
    <Layout className={styles.layout} footer>
        <Container>
            <Row>
                <Col>
                    <ContentMDX />
                </Col>
            </Row>
        </Container>
    </Layout>
)

export default GettingStartedPage
