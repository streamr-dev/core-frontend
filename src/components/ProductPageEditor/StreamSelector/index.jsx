// @flow

import React from 'react'
import { Container } from '@streamr/streamr-layout'
import classNames from 'classnames'
import styles from './streamListing.pcss'
import pageStyles from '../productPageEditor.pcss'

import type { Stream, StreamList } from '../../../flowtype/stream-types'
import { Row, HeaderRow } from '../../Table'

export type Props = {
    fetchingStreams: boolean,
    streams: StreamList,
}

const StreamSelector = ({ streams, fetchingStreams }: Props) => (
    <div className={classNames(styles.details, pageStyles.section)}>
        <Container>
            <div className={classNames(styles.streams)}>
                <HeaderRow title={`Streams (${ streams.length || 0 })`}>
                    Description
                </HeaderRow>
                <hr />
                {fetchingStreams && (
                    <Row>
                        Loading streams...
                    </Row>
                )}
                {!fetchingStreams && streams.length > 0 && streams.map(({ id, name, description }: Stream) => (
                    <Row key={id} title={name}>
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

export default StreamSelector
