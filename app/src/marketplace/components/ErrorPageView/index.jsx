// @flow

import * as React from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'

import BodyClass, { PAGE_SECONDARY } from '$shared/components/BodyClass'
import EmptyState from '$shared/components/EmptyState'
import Layout from '../Layout'
import links from '../../../links'
import appCrashedImage from '$shared/assets/images/app_crashed.png'
import appCrashedImage2x from '$shared/assets/images/app_crashed@2x.png'

import styles from './errorPageView.pcss'

const ErrorPageView = () => (
    <Layout className={styles.errorPageView}>
        <BodyClass className={PAGE_SECONDARY} />
        <Container>
            <EmptyState
                image={(
                    <img
                        className={styles.image}
                        src={appCrashedImage}
                        srcSet={`${appCrashedImage2x} 2x`}
                        alt={I18n.t('errorPageView.imageCaption')}
                    />
                )}
                link={(
                    <React.Fragment>
                        <Link
                            to={links.marketplace.main}
                            className="btn btn-special"
                        >
                            <Translate value="errorPageView.top" />
                        </Link>
                        <Link
                            to={links.userpages.products}
                            className="btn btn-special d-none d-md-inline-block"
                        >
                            <Translate value="general.products" />
                        </Link>
                    </React.Fragment>
                )}
                linkOnMobile
            >
                <Translate value="errorPageView.message" dangerousHTML />
            </EmptyState>
        </Container>
    </Layout>
)

export default ErrorPageView
