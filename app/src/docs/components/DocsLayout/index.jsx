// @flow

import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { MDXProvider } from '@mdx-js/tag'

import type { NavigationLink } from '../../flowtype/navigation-types'
import Layout from '$mp/components/Layout'
import Navigation from './Navigation'
import mainNav from './Navigation/navLinks'
import Components from '$docs/mdxConfig'

import styles from './docsLayout.pcss'

type Props = {
    subNav?: NavigationLink,
}

const DocsLayout = ({ subNav, ...props }: Props = {}) => (
    <Layout className={styles.docsLayout} footer>
        <Navigation
            className={styles.mobileNav}
            format="mobile"
            navigationItems={mainNav}
        />
        <Container>
            <Row>
                <Col md={12} lg={3}>
                    <Navigation
                        className={styles.desktopNav}
                        format="desktop"
                        navigationItems={mainNav}
                        subNavigationItems={subNav}
                    />
                </Col>
                <Col md={12} lg={9}>
                    <MDXProvider components={Components}>
                        <div {...props} />
                    </MDXProvider>
                </Col>
            </Row>
        </Container>
    </Layout>
)

export default DocsLayout
