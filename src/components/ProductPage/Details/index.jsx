// @flow

import React, { Component } from 'react'
import { Container } from '@streamr/streamr-layout'
import classNames from 'classnames'
import styles from './details.pcss'
import pageStyles from '../productPage.pcss'

import type { Stream, StreamList } from '../../../flowtype/stream-types'
import { Row, HeaderRow, EmptyRow } from '../Table'

export type Props = {
    fetchingStreams: boolean,
    streams: StreamList,
}

export default class Details extends Component<Props> {
    render() {
        const { streams, fetchingStreams } = this.props

        return (
            <div className={classNames(styles.details, pageStyles.section)}>
                <Container>
                    <div className={classNames(styles.streams)}>
                        <HeaderRow name={`Streams (${streams.length || 0})`} description="Description" />
                        <hr />
                        {fetchingStreams && (
                            <EmptyRow description="Loading streams..." />
                        )}
                        {!fetchingStreams && streams.length > 0 && streams.map(({id, name, description}: Stream) => (
                            <Row key={id} name={name} description={description} />
                        ))}
                    </div>
                </Container>
            </div>
        )
    }
}
