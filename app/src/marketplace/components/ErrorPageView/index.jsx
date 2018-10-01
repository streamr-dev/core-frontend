// @flow

import * as React from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'

import BodyClass, { PAGE_SECONDARY } from '../BodyClass'
import EmptyState from '../EmptyState'
import links from '../../../links'
import appCrashedImage from '../../assets/app_crashed.png'
import appCrashedImage2x from '../../assets/app_crashed@2x.png'

import styles from './errorPageView.pcss'

const ErrorPageView = () => (
    <div className={styles.errorPageView}>
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
                            to={links.main}
                            className="btn btn-special"
                        >
                            <Translate value="errorPageView.top" />
                        </Link>
                        <Link
                            to={links.myProducts}
                            className="btn btn-special hidden-sm-down"
                        >
                            <Translate value="general.myProducts" />
                        </Link>
                    </React.Fragment>
                )}
                linkOnMobile
            >
                <Translate value="errorPageView.message" dangerousHTML />
            </EmptyState>
        </Container>
    </div>
)

export default ErrorPageView
