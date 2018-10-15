// @flow

import React from 'react'
import { Container, Row } from 'reactstrap'

// $FlowFixMe
import ExampleDoc from './exampleDoc.md'

const LandingPage = () => (
    <Container>
        <Row>
            <ExampleDoc />
        </Row>
    </Container>
)

export default LandingPage
