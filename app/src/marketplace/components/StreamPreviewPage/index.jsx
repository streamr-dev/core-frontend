// @flow

import React, { useState, useEffect, useCallback, useMemo, useContext, useRef } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import findIndex from 'lodash/findIndex'
import { Translate, I18n } from 'react-redux-i18n'
import { useSelector, useDispatch } from 'react-redux'
import { getMyStreamPermissions } from '$userpages/modules/userPageStreams/actions'
import { selectPermissions, selectFetching } from '$userpages/modules/userPageStreams/selectors'
import UnauthorizedError from '$shared/errors/UnauthorizedError'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import { handleLoadError } from '$auth/utils/loginInterceptor'
import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'
import useFailure from '$shared/hooks/useFailure'

import type { StreamId, StreamList } from '$shared/flowtype/stream-types'
import type { User } from '$shared/flowtype/user-types'
import type { ProductId } from '../../flowtype/product-types'
import Button from '$shared/components/Button'
import routes from '$routes'
import BodyClass from '$shared/components/BodyClass'
import LoadingIndicator from '$shared/components/LoadingIndicator'

import StreamLivePreviewTable, { type DataPoint } from './StreamLivePreview'
import styles from './streamPreviewPage.pcss'
import InspectorSidebar from './InspectorSidebar'
import CopyStreamIdButton from './CopyStreamIdButton'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { Context as ClientContext, Provider as ClientProvider } from '$shared/contexts/StreamrClient'
import useIsMounted from '$shared/hooks/useIsMounted'

type Props = {
    match: {
        params: {
            streamId: StreamId,
        },
    },
    productId: ProductId,
    streams: StreamList,
    currentUser: ?User,
    getStreams: () => void,
    onClose: () => void,
}

const addStreamIdCopiedNotification = () => {
    Notification.push({
        title: I18n.t('notifications.streamIdCopied'),
        icon: NotificationIcon.CHECKMARK,
    })
}

const getStreamTabUrl = (productId: ProductId, streamId: ?StreamId) => (streamId ? routes.streamPreview({
    id: productId,
    streamId,
}) : '#')

const StreamPreviewPage = ({
    productId,
    getStreams,
    match,
    streams,
    onClose,
    currentUser,
}: Props) => {
    const [selectedDataPoint, setSelectedDataPoint] = useState(null)
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const [hasData, setHasData] = useState(false)
    const { hasLoaded } = useContext(ClientContext)
    const isMounted = useIsMounted()

    const urlId = match.params.streamId

    useEffect(() => {
        getStreams()
    }, [getStreams])

    useEffect(() => {
        setSelectedDataPoint(null)
    }, [urlId])

    const onSelectDataPoint = useCallback((p: DataPoint, initial: ?boolean) => {
        setSelectedDataPoint(p)
        setSidebarVisible(!initial)
    }, [])

    const currentStreamIndex = useMemo(() => findIndex(streams, (s) => s.id === urlId), [streams, urlId])

    const currentStream = useMemo(() => streams && streams[currentStreamIndex], [streams, currentStreamIndex])

    const prevStreamId = useMemo(
        () => (
            (currentStreamIndex > 0 && streams[currentStreamIndex - 1].id) || null),
        [streams, currentStreamIndex],
    )
    const nextStreamId = useMemo(
        () => (
            (currentStreamIndex >= 0 && currentStreamIndex < streams.length - 1 && streams[currentStreamIndex + 1].id) || null),
        [streams, currentStreamIndex],
    )

    const toggleSidebar = useCallback(() => {
        setSidebarVisible(!sidebarVisible)
    }, [sidebarVisible])

    const prevStreamUrl = getStreamTabUrl(productId, prevStreamId)
    const nextStreamUrl = getStreamTabUrl(productId, nextStreamId)

    const setData = useCallback(() => {
        if (!isMounted()) { return }
        setHasData(true)
    }, [isMounted])

    const permissions = useSelector(selectPermissions)

    const dispatch = useDispatch()

    const fetching = useSelector(selectFetching)

    const fail = useFailure()

    const idRef = useRef(urlId)

    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (ready) {
            return
        }

        const fetch = async (id) => {
            if (!id) {
                return
            }
            try {
                try {
                    await dispatch(getMyResourceKeys())
                } catch (e) { /**/ }
                if (!isMounted()) {
                    return
                }
                try {
                    await dispatch(getMyStreamPermissions(id))
                } catch (e) {
                    await handleLoadError(e)
                }
                if (isMounted()) {
                    setReady(true)
                }
            } catch (e) {
                if (e instanceof ResourceNotFoundError) {
                    fail(e)
                    return
                }
                Notification.push({
                    title: e.message,
                    icon: NotificationIcon.ERROR,
                })
                throw e
            }
        }

        fetch(idRef.current)
    }, [ready, dispatch, fail, isMounted])

    useEffect(() => {
        idRef.current = urlId
        setReady(false)
    }, [urlId])

    const canRead = (permissions || []).includes('read')

    if (ready && !fetching && !canRead) {
        throw new UnauthorizedError()
    }

    if (!ready || fetching) {
        return null
    }

    return (
        <div className={styles.streamLiveDataDialog}>
            <BodyClass className="overflow-hidden" />
            <LoadingIndicator
                className={styles.loadingIndicator}
                loading={!hasLoaded}
            />
            <div className={styles.closeRow}>
                <Button
                    className={styles.closeButton}
                    onClick={onClose}
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
                    onClick={toggleSidebar}
                >
                    <Translate
                        value={sidebarVisible ?
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
                            {hasData ? (
                                <Translate value="modal.streamLiveData.liveData" />
                            ) :
                                <Translate value="modal.streamLiveData.noLiveData" />
                            }
                        </p>
                    </h2>
                    <div className={styles.body}>
                        {currentStream && (
                            <StreamLivePreviewTable
                                key={`${currentStream.id}`} // Rerender if streamId or apiKey changes
                                streamId={currentStream.id}
                                currentUser={currentUser}
                                onSelectDataPoint={onSelectDataPoint}
                                selectedDataPoint={selectedDataPoint}
                                hasData={setData}
                            />
                        )}
                    </div>
                    {productId &&
                        <div className={styles.footer}>
                            <Button
                                kind="secondary"
                                disabled={!prevStreamId}
                                className={styles.button}
                                to={prevStreamUrl}
                                tag={Link}
                            >
                                <Translate value="modal.streamLiveData.previous" />
                            </Button>
                            <Button
                                kind="secondary"
                                disabled={!nextStreamId}
                                className={styles.button}
                                to={nextStreamUrl}
                                tag={Link}
                            >
                                <Translate value="modal.streamLiveData.next" />
                            </Button>
                        </div>
                    }
                </div>
            </div>
            <div
                className={classnames(styles.sidebar, 'd-none d-md-block', {
                    [styles.visible]: sidebarVisible, // only affects on tablet
                })}
            >
                <InspectorSidebar
                    streamId={currentStream && currentStream.id}
                    dataPoint={selectedDataPoint}
                    currentUser={currentUser}
                    onStreamIdCopy={addStreamIdCopiedNotification}
                />
            </div>
        </div>
    )
}

export default (props: Props) => (
    <ClientProvider key={props.match.params.streamId}>
        <StreamPreviewPage {...props} />
    </ClientProvider>
)
