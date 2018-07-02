// @flow

import React from 'react'
import { Container } from '@streamr/streamr-layout'
import { Link } from 'react-router-dom'
import BodyClass, { PAGE_SECONDARY } from '../BodyClass'
import EmptyState from '../EmptyState'
import links from '../../links'
import styles from './notFoundPage.pcss'

const NotFoundPage = () => (
    <div className={styles.notFoundPage}>
        <BodyClass className={PAGE_SECONDARY} />
        <Container>
            <EmptyState
                image={(
                    <img
                        src="/assets/404_blocks.png"
                        srcSet="/assets/404_blocks@2x.png 2x"
                        alt=""
                    />
                )}
                link={(
                    <Link
                        to={links.main}
                        className="btn btn-special"
                    >
                        Go to the marketplace top
                    </Link>
                )}
                linkOnMobile
            >
                Whoops! We don’t seem to be able to find your data.<br />
                Something might have been moved around or changed.
            </EmptyState>
        </Container>
    </div>
)

export default NotFoundPage
