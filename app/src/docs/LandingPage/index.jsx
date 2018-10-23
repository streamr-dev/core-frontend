// @flow

import React from 'react'
import { Container, Row, Col } from 'reactstrap'

// $FlowFixMe
import ExampleDoc from './exampleDoc.mdx'
import Layout from '$mp/components/Layout'

import styles from './landingPage.pcss'

const LandingPage = () => (
    <Layout className={styles.layout} footer>
        <Container>
            <Row>
                <Col>
                    <ExampleDoc />
                </Col>
            </Row>
        </Container>
    </Layout>
)

export default LandingPage
