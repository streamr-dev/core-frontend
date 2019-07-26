// @flow

import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { MDXProvider } from '@mdx-js/react'

import type { NavigationLink } from '$docs/flowtype/navigation-types'
import Layout from '$mp/components/Layout'
import Navigation from './Navigation'
import mainNav from './Navigation/navLinks'
import Components from '$docs/mdxConfig'
import PageTurner from '$docs/components/PageTurner'

import styles from './docsLayout.pcss'

type Props = {
    subNav?: NavigationLink,
}

const DocsLayout = ({ subNav, ...props }: Props = {}) => (
    <Layout className={styles.docsLayout} footer>
        <Navigation
            responsive
            navigationItems={mainNav}
        />
        <Container>
            <Row>
                <Col md={12} lg={3}>
                    <Navigation
                        navigationItems={mainNav}
                        subNavigationItems={subNav}
                    />
                </Col>
                <Col md={12} lg={9}>
                    <MDXProvider components={Components}>
                        <div {...props} />
                    </MDXProvider>
                    <PageTurner navigationItems={mainNav} />
                </Col>
            </Row>
        </Container>
    </Layout>
)

export default DocsLayout
