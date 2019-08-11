// @flow

import React from 'react'
import { Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Translate, I18n } from 'react-redux-i18n'

import BodyClass, { PAGE_SECONDARY } from '$shared/components/BodyClass'
import EmptyState from '$shared/components/EmptyState'
import Layout from '$shared/components/Layout'
import links from '../../../links'
import pageNotFoundPic from '$shared/assets/images/404_blocks.png'
import pageNotFoundPic2x from '$shared/assets/images/404_blocks@2x.png'
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
                        <Link
                            to={links.userpages.main}
                            className="btn btn-special"
                        >
                            <Translate value="notFoundPage.coreApp" />
                        </Link>
                        <Link
                            to={links.marketplace.main}
                            className="btn btn-special"
                        >
                            <Translate value="notFoundPage.top" />
                        </Link>
                        <Link
                            to={links.root}
                            className="btn btn-special"
                        >
                            <Translate value="notFoundPage.publicSite" />
                        </Link>
                    </React.Fragment>
                )}
                linkOnMobile
            >
                <Translate value="notFoundPage.message" dangerousHTML />
            </EmptyState>
        </Container>
    </Layout>
)

export default NotFoundPage
