// @flow

import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import SimpleReactLightbox from 'simple-react-lightbox'
import Layout from '$shared/components/Layout'
import Navigation from './Navigation'
import Components from '$docs/mdxConfig'
import PageTurner from '$docs/components/PageTurner'
import DocsContainer from '$shared/components/Container/Docs'
import styles from './docsLayout.pcss'
import useScrollToTop from '$shared/hooks/useScrollToTop'

type Props = {}

const DocsLayout = ({ ...props }: Props = {}) => {
    useScrollToTop()

    return (
        <SimpleReactLightbox>
            <Layout className={styles.docsLayout} footer>
                <Navigation
                    responsive
                />
                <DocsContainer>
                    <div className={styles.grid}>
                        <div>
                            <Navigation />
                        </div>
                        <div className={styles.content}>
                            <MDXProvider components={Components}>
                                <div {...props} />
                            </MDXProvider>
                            <PageTurner />
                        </div>
                    </div>
                </DocsContainer>
            </Layout>
        </SimpleReactLightbox>
    )
}

export default DocsLayout
