// @flow

import React, { type Node } from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'

import BodyClass, { PAGE_SECONDARY } from '$shared/components/BodyClass'
import EmptyState from '$shared/components/EmptyState'
import Layout from '$shared/components/Layout'
import appCrashedImage from '$shared/assets/images/app_crashed.png'
import appCrashedImage2x from '$shared/assets/images/app_crashed@2x.png'
import Button from '$shared/components/Button'
import routes from '$routes'

import styles from './genericErrorPage.pcss'

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
                    alt={I18n.t('genericErrorPage.imageCaption')}
                />
            )}
            link={children}
            linkOnMobile
        >
            <Translate
                value="genericErrorPage.message"
                dangerousHTML
                tag="p"
            />
        </EmptyState>
    </Container>
)

const GenericErrorPage = () => (
    <Layout className={styles.genericErrorPage}>
        <BodyClass className={PAGE_SECONDARY} />
        <ErrorPageContent>
            <Button
                kind="special"
                tag={Link}
                to={routes.marketplace.index()}
            >
                <Translate value="genericErrorPage.top" />
            </Button>
            <Button
                kind="special"
                tag={Link}
                to={routes.products.index()}
                className="d-none d-md-flex"
            >
                Products
            </Button>
        </ErrorPageContent>
    </Layout>
)

export default GenericErrorPage
