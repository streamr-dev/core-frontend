// @flow

import React from 'react'
import { Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Translate, I18n } from 'react-redux-i18n'

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
                        alt={I18n.t('error.notFound')}
                    />
                )}
                link={(
                    <React.Fragment>
                        <Button
                            kind="special"
                            tag={Link}
                            to={routes.core()}
                        >
                            <Translate value="notFoundPage.coreApp" />
                        </Button>
                        <Button
                            kind="special"
                            tag={Link}
                            to={routes.marketplace.index()}
                        >
                            <Translate value="notFoundPage.top" />
                        </Button>
                        <Button
                            kind="special"
                            tag={Link}
                            to={routes.root()}
                        >
                            <Translate value="notFoundPage.publicSite" />
                        </Button>
                    </React.Fragment>
                )}
                linkOnMobile
            >
                <Translate
                    value="notFoundPage.message"
                    dangerousHTML
                    tag="p"
                />
            </EmptyState>
        </Container>
    </Layout>
)

export default NotFoundPage
