// @flow

import React from 'react'
import classnames from 'classnames'
import { Link, type Match } from 'react-router-dom'
import findIndex from 'lodash/findIndex'
import { Translate } from 'react-redux-i18n'

import { Button } from 'reactstrap'
import StreamLivePreviewTable, { type DataPoint } from '../../StreamLivePreview'
import type { StreamId, StreamList } from '../../../flowtype/stream-types'
import type { ApiKey, User } from '../../../flowtype/user-types'
import { formatPath } from '../../../utils/url'
import type { Product } from '../../../flowtype/product-types'
import links from '../../../../links'

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
                            <span className={styles.icon}>
                                <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <g id="Product-Detail-Views" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
                                        <g id="Live-Data-view--detail" transform="translate(-32.000000, -32.000000)" stroke="#323232">
                                            <g id="Icons-/-X-/-Gray-/-Big" transform="translate(24.000000, 24.000000)">
                                                <g id="X-gray" transform="translate(9.000000, 9.000000)">
                                                    <path d="M0,0 L13.1993266,13.1993266" id="Line-Copy-3" strokeEidth="1.5" />
                                                    <path
                                                        d="M0,0 L13.1993266,13.1993266"
                                                        id="Line-Copy-3"
                                                        strokeWidth="1.5"
                                                        transform="translate(6.599663, 6.599663) scale(-1, 1) translate(-6.599663, -6.599663) "
                                                    />
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </span>
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
