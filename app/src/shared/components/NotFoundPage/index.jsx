// @flow

import React from 'react'
import { Container } from 'reactstrap'
import { Link } from 'react-router-dom'

import BodyClass, { PAGE_SECONDARY } from '$shared/components/BodyClass'
import EmptyState from '$shared/components/EmptyState'
import Layout from '$shared/components/Layout'
import pageNotFoundPic from '$shared/assets/images/404_blocks.png'
import pageNotFoundPic2x from '$shared/assets/images/404_blocks@2x.png'
import Button from '$shared/components/Button'
import routes from '$routes'

import styles from './notFoundPage.pcss'

const NotFoundPage = () => (
    <Layout className={styles.notFoundPage}>
        <BodyClass className={PAGE_SECONDARY} />
        <Container>
            <EmptyState
                image={(
                    <img
                        src={pageNotFoundPic}
                        srcSet={`${pageNotFoundPic2x} 2x`}
                        alt="Not found"
                    />
                )}
                link={(
                    <React.Fragment>
                        <Button
                            kind="special"
                            tag={Link}
                            to={routes.core()}
                        >
                            Go to core app
                        </Button>
                        <Button
                            kind="special"
                            tag={Link}
                            to={routes.marketplace.index()}
                        >
                            Go to marketplace
                        </Button>
                        <Button
                            kind="special"
                            tag={Link}
                            to={routes.root()}
                        >
                            Go to public site
                        </Button>
                    </React.Fragment>
                )}
                linkOnMobile
            >
                <p>
                    Whoops! We don&apos;t seem to be able to find your data.
                    <br />
                    <small>Something might have been moved around or changed.</small>
                </p>
            </EmptyState>
        </Container>
    </Layout>
)

export default NotFoundPage
