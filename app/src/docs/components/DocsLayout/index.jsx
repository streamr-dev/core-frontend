// @flow

import React from 'react'
import { MDXProvider } from '@mdx-js/react'

import type { NavigationLink } from '$docs/flowtype/navigation-types'
import Layout from '$shared/components/Layout'
import Navigation from './Navigation'
import mainNav from './Navigation/navLinks'
import Components from '$docs/mdxConfig'
import PageTurner from '$docs/components/PageTurner'
import DocsContainer from '$shared/components/Container/Docs'

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
        <DocsContainer>
            <div className={styles.grid}>
                <div>
                    <Navigation
                        navigationItems={mainNav}
                        subNavigationItems={subNav}
                    />
                </div>
                <div className={styles.content}>
                    <MDXProvider components={Components}>
                        <div {...props} />
                    </MDXProvider>
                    <PageTurner navigationItems={mainNav} />
                </div>
            </div>
        </DocsContainer>
    </Layout>
)

export default DocsLayout
