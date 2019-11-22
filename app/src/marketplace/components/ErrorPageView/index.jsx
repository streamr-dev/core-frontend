// @flow

import React, { type Node } from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'

import BodyClass, { PAGE_SECONDARY } from '$shared/components/BodyClass'
import EmptyState from '$shared/components/EmptyState'
import Layout from '$shared/components/Layout'
import links from '../../../links'
import appCrashedImage from '$shared/assets/images/app_crashed.png'
import appCrashedImage2x from '$shared/assets/images/app_crashed@2x.png'
import Button from '$shared/components/Button'

import styles from './errorPageView.pcss'

type Props = {
    children?: Node,
}

export const ErrorPageContent = ({ children }: Props) => (
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
            link={children}
            linkOnMobile
        >
            <Translate value="errorPageView.message" dangerousHTML />
        </EmptyState>
    </Container>
)

const ErrorPageView = () => (
    <Layout className={styles.errorPageView}>
        <BodyClass className={PAGE_SECONDARY} />
        <ErrorPageContent>
            <Button
                kind="special"
                tag={Link}
                to={links.marketplace.main}
            >
                <Translate value="errorPageView.top" />
            </Button>
            <Button
                kind="special"
                tag={Link}
                to={links.userpages.products}
                className="d-none d-md-inline-block"
            >
                <Translate value="general.products" />
            </Button>
        </ErrorPageContent>
    </Layout>
)

export default ErrorPageView
