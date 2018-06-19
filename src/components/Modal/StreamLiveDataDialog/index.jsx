// @flow

import React from 'react'
import classnames from 'classnames'
import { Link, type Match } from 'react-router-dom'
import findIndex from 'lodash/findIndex'

import { Button } from 'reactstrap'
import StreamLivePreviewTable, { type DataPoint } from '../../StreamLivePreview'
import type { StreamId, StreamList } from '../../../flowtype/stream-types'
import type { ApiKey, User } from '../../../flowtype/user-types'
import { formatPath } from '../../../utils/url'
import type { Product } from '../../../flowtype/product-types'
import links from '../../../links'

import styles from './streamLiveDataDialog.pcss'
import InspectorSidebar from './InspectorSidebar'

type Props = {
    match: Match,
    product: Product,
    streams: StreamList,
    currentUser: ?User,
    apiKey: ?ApiKey,
    getApiKeys: () => void,
}

type State = {
    selectedDataPoint: ?DataPoint,
}

class StreamLiveDataDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        if (document.body) {
            document.body.classList.add('overflow-hidden')
        }
        this.state = {
            selectedDataPoint: null,
        }
    }

    componentDidMount() {
        this.props.getApiKeys()
    }

    componentWillReceiveProps = (newProps: Props) => {
        if (newProps.match.params.streamId !== this.props.match.params.streamId) {
            this.setState({
                selectedDataPoint: null,
            })
        }
    }

    componentWillUnmount() {
        if (document.body) {
            document.body.classList.remove('overflow-hidden')
        }
    }

    onSelectDataPoint = (p: DataPoint) => {
        this.setState({
            selectedDataPoint: p,
        })
    }

    getCurrentStreamIndex = () => {
        const { streams, match } = this.props
        return findIndex(streams, (s) => s.id === match.params.streamId)
    }

    getNextStreamId = (): ?StreamId => {
        const { streams } = this.props
        const index = this.getCurrentStreamIndex()
        if (index >= 0 && index < streams.length - 1) {
            return streams[index + 1].id
        }
        return null
    }

    getPrevStreamId = (): ?StreamId => {
        const { streams } = this.props
        const index = this.getCurrentStreamIndex()
        if (index > 0) {
            return streams[index - 1].id
        }
        return null
    }

    render() {
        const {
            streams, product, match,
            currentUser, apiKey,
        } = this.props
        const currentStream = streams.find((s) => s.id === match.params.streamId)
        const prevStreamId = this.getPrevStreamId()
        const nextStreamId = this.getNextStreamId()
        const prevStreamUrl = (prevStreamId && product && product.id && formatPath(links.products, product.id, 'streamPreview', prevStreamId)) || '#'
        const nextStreamUrl = (nextStreamId && product && product.id && formatPath(links.products, product.id, 'streamPreview', nextStreamId)) || '#'
        return (
            <div className={styles.streamLiveDataDialog}>
                <div className={styles.closeRow}>
                    <Link to={formatPath(links.products, product.id || '')}>
                        <button className={classnames(styles.closeButton)}>
                            <span className={classnames(styles.icon, 'icon-caret-left')} />
                            <span className={classnames(styles.text, 'ff-plex-mono', 'uppercase')}>
                                Back
                            </span>
                        </button>
                    </Link>
                </div>
                <div className={styles.tableContainer}>
                    <div className={styles.innerTableContainer}>
                        <h2 className={styles.title}>
                            {currentStream && currentStream.name}
                            <p className={styles.subtitle}>
                                Live Data
                            </p>
                        </h2>
                        <div className={styles.body}>
                            {currentStream && (
                                <StreamLivePreviewTable
                                    key={`${currentStream.id}${apiKey ? apiKey.id : ''}`} // Rerender if streamId or apiKey changes
                                    streamId={currentStream.id}
                                    currentUser={currentUser}
                                    apiKey={apiKey}
                                    onSelectDataPoint={this.onSelectDataPoint}
                                    selectedDataPoint={this.state.selectedDataPoint}
                                />
                            )}
                        </div>
                        <div className={styles.footer}>
                            <Link to={prevStreamUrl}>
                                <Button
                                    outline
                                    color="secondary"
                                    disabled={!prevStreamId}
                                >
                                    Previous
                                </Button>
                            </Link>
                            <Link to={nextStreamUrl}>
                                <Button
                                    outline
                                    color="secondary"
                                    disabled={!nextStreamId}
                                >
                                    Next
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles.sidebar}>
                    <InspectorSidebar
                        dataPoint={this.state.selectedDataPoint}
                        currentUser={currentUser}
                    />
                </div>
            </div>
        )
    }
}

export default StreamLiveDataDialog
