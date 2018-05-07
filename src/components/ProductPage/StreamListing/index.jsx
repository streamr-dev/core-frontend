// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Button } from '@streamr/streamr-layout'
import classNames from 'classnames'

import pageStyles from '../productPage.pcss'
import type { Stream, StreamList, StreamId } from '../../../flowtype/stream-types'
import { Row, HeaderRow } from '../../Table'
import { formatPath } from '../../../utils/url'
import type { Product, ProductId } from '../../../flowtype/product-types'
import links from '../../../links'

import styles from './streamListing.pcss'

export type Props = {
    product: ?Product,
    fetchingStreams: boolean,
    streams: StreamList,
    showStreamActions?: boolean,
    isLoggedIn?: boolean,
    isProductFree?: boolean,
    isProductSubscriptionValid?: boolean,
}

const hoverComponent = (
    productId: ?ProductId, streamId: StreamId, isLoggedIn: boolean,
    isProductFree: boolean, isProductSubscriptionValid: boolean,
) => (
    <div>
        {(isLoggedIn && (isProductFree || isProductSubscriptionValid)) &&
            <Button color="primary" size="sm">Add to editor</Button>
        }
        {/* No need to show the preview button on editProduct page */}
        {(isProductFree || (isLoggedIn && isProductSubscriptionValid)) && productId && (
            <Link to={formatPath(links.products, productId, 'streamPreview', streamId)}>
                <Button color="primary" size="sm">
                     View live data
                </Button>
            </Link>
        )}
        {(!isProductFree && !isProductSubscriptionValid) &&
            <div>Purchase to unlock</div>
        }
        {(!isLoggedIn && !isProductFree && isProductSubscriptionValid) &&
            <div>Log in to interact with this stream</div>
        }
    </div>
)

const StreamListing = ({
    product,
    streams,
    fetchingStreams,
    showStreamActions,
    isLoggedIn,
    isProductFree,
    isProductSubscriptionValid,
}: Props) => (
    <div className={classNames(styles.details, pageStyles.section)}>
        <Container>
            <div className={classNames(styles.streams)}>
                <HeaderRow title={`Streams (${streams.length || 0})`}>
                    Description
                </HeaderRow>
                <hr />
                {fetchingStreams && (
                    <Row>
                        Loading streams...
                    </Row>
                )}
                {!fetchingStreams && streams.length > 0 && streams.map(({ id: streamId, name, description }: Stream) => (
                    <Row
                        key={streamId}
                        title={name}
                        hoverComponent={showStreamActions &&
                            hoverComponent(
                                product && product.id, streamId, !!isLoggedIn,
                                !!isProductFree, !!isProductSubscriptionValid,
                            )
                        }
                    >
                        {description}
                    </Row>
                ))}
                {!fetchingStreams && streams.length === 0 && (
                    <Row>
                        No streams found.
                    </Row>
                )}
            </div>
        </Container>
    </div>
)

export default StreamListing
