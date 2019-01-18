// @flow

import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import links from '../../links'
import Layout from '$mp/components/Layout'
import SideNav from './SideNav'

import styles from './docs.pcss'

type Props = {
    subNavigationItems?: Object,
}

const navigationItems = {
    Introduction: links.docs.introduction,
    'Getting Started': links.docs.home,
    Tutorials: links.docs.tutorials,
    'Visual Editor': links.docs.visualEditor,
    'Streamr Engine': links.docs.streamrEngine,
    Marketplace: links.docs.dataMarketplace,
    'Streamr APIs': links.docs.api,
}

const DocsLayout = ({ subNavigationItems, ...props }: Props = {}) => (
    <Layout className={styles.layout} footer>
        <Container>
            <Row>
                <Col md={12} lg={3}>
                    <SideNav navigationItems={navigationItems} subNavigationItems={subNavigationItems} />
                </Col>
                <Col md={12} lg={9}>
                    <div {...props} />
                </Col>
            </Row>
        </Container>
    </Layout>
)

export default DocsLayout
