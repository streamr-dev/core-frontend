// @flow

import React from 'react'
import { Container, Row, Col } from 'reactstrap'

// $FlowFixMe
import ExampleDoc from './exampleDoc.mdx'
// import Layout from '$mp/components/Layout'
const Layout = React.lazy(() => import('$mp/components/Layout'))
import styles from './landingPage.pcss'

/*eslint-disable */
const LandingPage = () => (typeof global.document !== 'undefined') ? (
    <Layout className={styles.layout} footer>
        <Container>
            <Row>
                <Col>
                    <ExampleDoc />
                </Col>
            </Row>
        </Container>
    </Layout>
) : (
    <Container>
        <Row>
            <Col>
                <ExampleDoc />
            </Col>
        </Row>
    </Container>
)

export default LandingPage
