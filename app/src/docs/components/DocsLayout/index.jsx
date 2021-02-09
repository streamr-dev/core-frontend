import React, { useMemo } from 'react'
import { MDXProvider } from '@mdx-js/react'
import SimpleReactLightbox from 'simple-react-lightbox'
import { withRouter } from 'react-router-dom'
import Layout from '$shared/components/Layout'
import Components from '$docs/mdxConfig'
import docsMap from '$docs/docsMap'
import PageTurner from '$docs/components/PageTurner'
import DocsContainer from '$shared/components/Container/Docs'
import BusLine from '$shared/components/BusLine'
import Button from '$shared/components/Button'
import SvgIcon from '$shared/components/SvgIcon'
import DocsNav from './DocsNav'
import styles from './docsLayout.pcss'
import Navigation from './Navigation'

const DocsLayout = ({ nav = <DocsNav />, location, staticContext, ...props }) => {
    const editFilePath = useMemo(() => {
        let path = null
        Object.values(docsMap).some((doc) => {
            const found = Object.values(doc).find((subdoc) => subdoc.path === location.pathname)
            if (found) {
                path = found.filePath
                return true
            }
            return false
        })
        return path
    }, [location])

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
                                    target="_blank"
                                    rel="noopener noreferrer"
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
