// @flow

import React from 'react'
import classnames from 'classnames'
import { Link, type Match } from 'react-router-dom'
import findIndex from 'lodash/findIndex'
import { Translate } from '@streamr/streamr-layout'

import { Button } from 'reactstrap'
import StreamLivePreviewTable, { type DataPoint } from '../../StreamLivePreview'
import type { StreamId, StreamList } from '../../../flowtype/stream-types'
import type { ApiKey, User } from '../../../flowtype/user-types'
import { formatPath } from '../../../utils/url'
import type { Product } from '../../../flowtype/product-types'
import links from '../../../links'

import styles from './streamLiveDataDialog.pcss'
import InspectorSidebar from './InspectorSidebar'
import CopyStreamIdButton from './CopyStreamIdButton'

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
    sidebarVisible: boolean,
}

class StreamLiveDataDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        if (document.body) {
            document.body.classList.add('overflow-hidden')
        }
    }

    state = {
        selectedDataPoint: null,
        sidebarVisible: false,
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

    onSelectDataPoint = (p: DataPoint, initial: ?boolean) => {
        this.setState({
            selectedDataPoint: p,
            sidebarVisible: !initial,
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

    toggleSidebar = () => {
        this.setState({
            sidebarVisible: !this.state.sidebarVisible,
        })
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
                            <Translate
                                value="modal.streamLiveData.back"
                                className={classnames(styles.text, 'ff-plex-mono', 'uppercase', 'hidden-sm-down')}
                            />
                        </button>
                    </Link>
                    {currentStream && (
                        <div className="hidden-md-up">
                            <CopyStreamIdButton streamId={currentStream.id} />
                        </div>
                    )}
                    <a
                        href="#"
                        className={classnames(styles.toggleSidebarButton, 'ff-plex-mono', 'uppercase', 'hidden-sm-down', 'hidden-xl-up')}
                        onClick={this.toggleSidebar}
                    >
                        <Translate
                            value={this.state.sidebarVisible ?
                                'modal.streamLiveData.inspectorSidebar.hide' :
                                'modal.streamLiveData.inspectorSidebar.show'}
                        />
                    </a>
                </div>
                <div className={styles.tableContainer}>
                    <div className={styles.innerTableContainer}>
                        <h2 className={styles.title}>
                            {currentStream && currentStream.name}
                            <p className={styles.subtitle}>
                                <Translate value="modal.streamLiveData.liveData" />
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
                            <Button
                                outline
                                color="secondary"
                                disabled={!prevStreamId}
                                className={classnames(styles.button, styles.prevbutton)}
                                to={prevStreamUrl}
                                tag={Link}
                            >
                                <Translate value="modal.streamLiveData.previous" />
                            </Button>
                            <Button
                                outline
                                color="secondary"
                                disabled={!nextStreamId}
                                className={classnames(styles.button, styles.nextButton)}
                                to={nextStreamUrl}
                                tag={Link}
                            >
                                <Translate value="modal.streamLiveData.next" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div
                    className={classnames(styles.sidebar, 'hidden-sm-down', {
                        [styles.visible]: this.state.sidebarVisible, // only affects on tablet
                    })}
                >
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
