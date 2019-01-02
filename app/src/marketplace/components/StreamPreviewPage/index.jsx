// @flow

import React from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import findIndex from 'lodash/findIndex'
import { Translate, I18n } from 'react-redux-i18n'

import { Button } from 'reactstrap'
import type { StreamId, StreamList } from '$shared/flowtype/stream-types'
import type { ApiKey, User } from '$shared/flowtype/user-types'
import type { ProductId } from '../../flowtype/product-types'
import routes from '$routes'

import StreamLivePreviewTable, { type DataPoint } from './StreamLivePreview'
import styles from './streamPreviewPage.pcss'
import InspectorSidebar from './InspectorSidebar'
import CopyStreamIdButton from './CopyStreamIdButton'
import Notification from '$shared/utils/Notification'
import NotificationIcon from '$shared/utils/NotificationIcon'

type Props = {
    match: {
        params: {
            streamId: StreamId,
        },
    },
    productId: ProductId,
    streams: StreamList,
    currentUser: ?User,
    apiKey: ?ApiKey,
    getApiKeys: () => void,
    getStreams: () => void,
}

type State = {
    selectedDataPoint: ?DataPoint,
    sidebarVisible: boolean,
}

const addStreamIdCopiedNotification = () => {
    Notification.push({
        title: I18n.t('notifications.streamIdCopied'),
        icon: NotificationIcon.CHECKMARK,
    })
}

class StreamPreviewPage extends React.Component<Props, State> {
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
        this.props.getStreams()
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
        const { streams, match: { params: { streamId } } } = this.props
        return findIndex(streams, (s) => s.id === streamId)
    }

    getPrevStreamId = () => {
        const { streams } = this.props
        const index = this.getCurrentStreamIndex()
        return (index > 0 && streams[index - 1].id) || null
    }

    getNextStreamId = () => {
        const { streams } = this.props
        const index = this.getCurrentStreamIndex()
        return (index >= 0 && index < streams.length - 1 && streams[index + 1].id) || null
    }

    getStreamTabUrl = (streamId: ?StreamId) => (streamId ? routes.streamPreview({
        id: this.props.productId,
        streamId,
    }) : '#')

    toggleSidebar = () => {
        this.setState({
            sidebarVisible: !this.state.sidebarVisible,
        })
    }

    render() {
        const {
            streams, productId, match: { params: { streamId } }, currentUser,
            apiKey,
        } = this.props
        const currentStream = streams.find((s) => s.id === streamId)
        const prevStreamId = this.getPrevStreamId()
        const nextStreamId = this.getNextStreamId()
        const prevStreamUrl = this.getStreamTabUrl(prevStreamId)
        const nextStreamUrl = this.getStreamTabUrl(nextStreamId)
        return (
            <div className={styles.streamLiveDataDialog}>
                <div className={styles.closeRow}>
                    <Button
                        className={classnames(styles.closeButton)}
                        tag={Link}
                        to={routes.product({
                            id: productId,
                        })}
                    >
                        <span className={styles.icon}>
                            <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                                <g
                                    strokeWidth="1.5"
                                    stroke="#323232"
                                    fill="none"
                                    fillRule="evenodd"
                                    strokeLinecap="round"
                                >
                                    <path d="M1 1l13.2 13.2M14.2 1L1 14.2" />
                                </g>
                            </svg>
                        </span>
                    </Button>
                    {currentStream && (
                        <div className="d-md-none">
                            <CopyStreamIdButton
                                streamId={currentStream.id}
                                onCopy={addStreamIdCopiedNotification}
                            />
                        </div>
                    )}
                    <a
                        href="#"
                        className={classnames(styles.toggleSidebarButton, 'ff-plex-mono', 'uppercase', 'd-none', 'd-md-inline', 'd-xl-none')}
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
                    className={classnames(styles.sidebar, 'd-none d-md-block', {
                        [styles.visible]: this.state.sidebarVisible, // only affects on tablet
                    })}
                >
                    <InspectorSidebar
                        streamId={currentStream && currentStream.id}
                        dataPoint={this.state.selectedDataPoint}
                        currentUser={currentUser}
                        onStreamIdCopy={addStreamIdCopiedNotification}
                    />
                </div>
            </div>
        )
    }
}

export default StreamPreviewPage
