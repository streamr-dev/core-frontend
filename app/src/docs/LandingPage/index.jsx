// @flow

import React from 'react'
import { Container, Row, Col } from 'reactstrap'

// $FlowFixMe
import ExampleDoc from './exampleDoc.mdx'

const LandingPage = () => (
    <Container>
        <Row>
            <Col>
                <ExampleDoc />
            </Col>
        </Row>
    </Container>
)

export default LandingPage
