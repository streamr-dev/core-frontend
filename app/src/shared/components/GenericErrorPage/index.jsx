// @flow

import React, { type Node } from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'reactstrap'

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
                    alt="App crashed"
                />
            )}
            link={children}
            linkOnMobile
        >
            <p>
                Oops. Something has broken down here.
                <br />
                Please try one of the links below
                <br />
                to get things back on track.
            </p>
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
                Marketplace top
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
