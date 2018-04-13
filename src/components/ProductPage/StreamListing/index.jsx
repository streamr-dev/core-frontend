// @flow

import React from 'react'
import { Container, Button } from '@streamr/streamr-layout'
import classNames from 'classnames'

import pageStyles from '../productPage.pcss'
import type { Stream, StreamList, StreamId } from '../../../flowtype/stream-types'
import { Row, HeaderRow } from '../../Table'

import styles from './streamListing.pcss'

export type Props = {
    fetchingStreams: boolean,
    streams: StreamList,
    showStreamActions?: boolean,
    isLoggedIn?: boolean,
    isProductFree?: boolean,
    isProductSubscriptionValid?: boolean,
}

const hoverComponent = (streamId: StreamId, isLoggedIn: boolean, isProductFree: boolean, isProductSubscriptionValid: boolean) => (
    <div>
        {(isLoggedIn && (isProductFree || isProductSubscriptionValid)) &&
            <Button color="primary" size="sm">Add to editor</Button>
        }
        {(isProductFree || (isLoggedIn && isProductSubscriptionValid)) &&
            <Button color="primary" size="sm">View live data</Button>
        }
        {(!isProductFree && !isProductSubscriptionValid) &&
            <div>Purchase to unlock</div>
        }
        {(!isLoggedIn && !isProductFree && isProductSubscriptionValid) &&
            <div>Log in to interact with this stream</div>
        }
    </div>
)

const StreamListing = ({
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
                {!fetchingStreams && streams.length > 0 && streams.map(({ id, name, description }: Stream) => (
                    <Row
                        key={id}
                        title={name}
                        hoverComponent={showStreamActions &&
                            hoverComponent(id, !!isLoggedIn, !!isProductFree, !!isProductSubscriptionValid)
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
