import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import SimpleReactLightbox from 'simple-react-lightbox'
import { withRouter } from 'react-router-dom'
import Layout from '$shared/components/Layout'
import Navigation from './Navigation'
import Components from '$docs/mdxConfig'
import docsMap from '$docs/docsMap'
import PageTurner from '$docs/components/PageTurner'
import DocsContainer from '$shared/components/Container/Docs'
import styles from './docsLayout.pcss'
import DocsNav from './DocsNav'
import BusLine from '$shared/components/BusLine'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'

const DocsLayout = ({ nav = <DocsNav />, location, staticContext, ...props }) => {
    let editFilePath = null
    Object.values(docsMap).some((doc) => {
        const found = Object.values(doc).find((subdoc) => subdoc.path === location.pathname)
        if (found) {
            editFilePath = found.filePath
            return true
        }
        return false
    })

    return (
        <SimpleReactLightbox>
            <Layout
                className={styles.docsLayout}
                footer
                nav={nav}
            >
                <Navigation
                    responsive
                />
                <DocsContainer>
                    <div className={styles.grid}>
                        <div>
                            <Navigation />
                        </div>
                        <div className={styles.content}>
                            {editFilePath && (
                                <Button
                                    className={styles.editButton}
                                    tag="a"
                                    href={`https://github.com/streamr-dev/streamr-platform/edit/development/app/src/docs/content/${editFilePath}`}
                                    kind="secondary"
                                    size="mini"
                                >
                                    <SvgIcon name="github" className={styles.githubIcon} />
                                    Edit on GitHub
                                </Button>
                            )}
                            <BusLine dynamicScrollPosition>
                                <MDXProvider components={Components}>
                                    <div {...props} />
                                </MDXProvider>
                            </BusLine>
                            <PageTurner />
                        </div>
                    </div>
                </DocsContainer>
            </Layout>
        </SimpleReactLightbox>
    )
}

export default withRouter(DocsLayout)
