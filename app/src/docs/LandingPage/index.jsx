// @flow

import React from 'react'
import { Container, Row, Col } from 'reactstrap'

// $FlowFixMe
import ExampleDoc from './exampleDoc.mdx'
import '../../marketplace/styles/sass/bootstrap.scss'
// import Layout from '$mp/components/Layout'
import styles from './landingPage.pcss'

const LandingPage = () => (
    <div className={styles.layout}>
        <Container>
            <Row>
                <Col>
                    <ExampleDoc />
                </Col>
            </Row>
        </Container>
    </div>
)

export default LandingPage
