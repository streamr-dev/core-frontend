// @flow

import React from 'react'
import { Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Translate } from '@streamr/streamr-layout'

import BodyClass, { PAGE_SECONDARY } from '../BodyClass'
import EmptyState from '../EmptyState'
import links from '../../links'
import pageNotFoundPic from '../../../assets/404_blocks.png'
import pageNotFoundPic2x from '../../../assets/404_blocks@2x.png'
import styles from './notFoundPage.pcss'

const NotFoundPage = () => (
    <div className={styles.notFoundPage}>
        <BodyClass className={PAGE_SECONDARY} />
        <Container>
            <EmptyState
                image={(
                    <img
                        src={pageNotFoundPic}
                        srcSet={`${pageNotFoundPic2x} 2x`}
                        alt=""
                    />
                )}
                link={(
                    <Link
                        to={links.main}
                        className="btn btn-special"
                    >
                        <Translate value="notFoundPage.top" />
                    </Link>
                )}
                linkOnMobile
            >
                <Translate value="notFoundPage.message" dangerousHTML />
            </EmptyState>
        </Container>
    </div>
)

export default NotFoundPage
