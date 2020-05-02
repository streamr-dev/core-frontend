// @flow

import React, { Component, useRef, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import { withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import qs from 'query-string'

import useIsMounted from '$shared/hooks/useIsMounted'
import StatusIcon from '$shared/components/StatusIcon'
import ConfigureAnchorOffset from '$shared/components/ConfigureAnchorOffset'
import type { Stream, StreamId } from '$shared/flowtype/stream-types'
import type { Operation } from '$userpages/flowtype/permission-types'
import type { StoreState } from '$shared/flowtype/store-state'
import type { User } from '$shared/flowtype/user-types'
import {
    getMyStreamPermissions,
    getStream,
    getStreamStatus,
    openStream,
    closeStream,
    updateStream,
    createStream,
    initEditStream,
    initNewStream,
    updateEditStream,
} from '$userpages/modules/userPageStreams/actions'
import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'
import { selectEditedStream, selectPermissions, selectFetching } from '$userpages/modules/userPageStreams/selectors'
import { selectUserData } from '$shared/modules/user/selectors'
import TOCPage from '$shared/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import routes from '$routes'
import links from '$shared/../links'
import breakpoints from '$app/scripts/breakpoints'

import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import CoreLayout from '$shared/components/Layout/Core'
import InfoView from './InfoView'
import KeyView from './KeyView'
import ConfigureView from './ConfigureView'
import PreviewView from './PreviewView'
import HistoryView from './HistoryView'
import SecurityView from './SecurityView'
import StatusView from './StatusView'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import useFailure from '$shared/hooks/useFailure'
import { handleLoadError } from '$auth/utils/loginInterceptor'

import styles from './streamShowView.pcss'

const { lg } = breakpoints

type OwnProps = {
    location: {
        search: string,
    },
}

type StateProps = {
    editedStream: ?Stream,
    permissions: ?Array<Operation>,
    currentUser: ?User,
    isFetching: ?boolean,
    isNewStream: boolean,
}

type State = {
    saving: boolean,
}

type DispatchProps = {
    createStream: () => Promise<StreamId>,
    getStream: (id: StreamId) => Promise<void>,
    openStream: (id: StreamId) => void,
    closeStream: () => void,
    getMyStreamPermissions: (id: StreamId) => void,
    save: (stream: ?Stream) => void,
    cancel: () => void,
    updateStream: (stream: Stream) => void,
    initEditStream: () => void,
    initNewStream: () => void,
    getKeys: () => void,
    redirectToUserPages: () => void,
    refreshStreamStatus: (id: StreamId) => void,
}

type RouterProps = {
    match: {
        params: {
            id: string
        }
    },
    history: {
        replace: (string) => void,
    },
}

type Props = StateProps & DispatchProps & RouterProps

export class StreamShowView extends Component<Props, State> {
    state = {
        saving: false,
    }

    unmounted: boolean = false

    componentWillUnmount() {
        this.props.closeStream()
        this.unmounted = true
    }

    onSave = (editedStream: Stream) => {
        // $FlowFixMe `save` missing in  `StateProps` or in `RouterProps`
        const { save, redirectToUserPages } = this.props

        this.setState({
            saving: true,
        }, async () => {
            try {
                await save(this.addTempIdsToStreamFields(editedStream) || editedStream)
                if (!this.unmounted) {
                    this.setState({
                        saving: false,
                    }, redirectToUserPages)
                }
            } catch (e) {
                console.warn(e)

                if (!this.unmounted) {
                    this.setState({
                        saving: false,
                    })
                }
            }
        })
    }

    addTempIdsToStreamFields = (editedStream: Stream) => {
        if (editedStream && editedStream.config && editedStream.config.fields) {
            editedStream.config.fields.map((field) => {
                if (field.id) {
                    delete field.id
                }
                return {
                    ...field,
                }
            })
            return {
                ...editedStream,
            }
        }
    }

    render() {
        const {
            editedStream,
            cancel,
            currentUser,
            permissions,
            isFetching,
            isNewStream,
        } = this.props
        const hasWritePermission = (permissions && permissions.some((p) => p === 'stream_edit')) || false
        const hasSharePermission = (permissions && permissions.some((p) => p === 'stream_share')) || false
        const isLoading = !!(!editedStream || isFetching)
        const disabled = !!(isLoading || !hasWritePermission)

        if (isLoading) {
            return (
                <CoreLayout
                    hideNavOnDesktop
                    loading={isLoading}
                />
            )
        }

        return (
            <CoreLayout
                hideNavOnDesktop
                navComponent={(
                    <MediaQuery minWidth={lg.min}>
                        {(isDesktop) => (
                            <Toolbar
                                altMobileLayout
                                actions={{
                                    cancel: {
                                        title: I18n.t('userpages.profilePage.toolbar.cancel'),
                                        kind: 'link',
                                        onClick: () => {
                                            cancel()
                                        },
                                    },
                                    saveChanges: {
                                        title: isDesktop ?
                                            I18n.t('userpages.profilePage.toolbar.saveAndExit') :
                                            I18n.t('userpages.profilePage.toolbar.done'),
                                        kind: 'primary',
                                        spinner: this.state.saving,
                                        onClick: () => {
                                            if (editedStream) {
                                                this.onSave(editedStream)
                                            }
                                        },
                                        disabled,
                                    },
                                }}
                            />
                        )}
                    </MediaQuery>
                )}
            >
                <MediaQuery minWidth={lg.min}>
                    <ConfigureAnchorOffset value={-80} />
                </MediaQuery>
                <TOCPage title={I18n.t(`userpages.streams.edit.details.pageTitle.${isNewStream ? 'newStream' : 'existingStream'}`)}>
                    <TOCPage.Section
                        id="details"
                        title={I18n.t('userpages.streams.edit.details.nav.details')}
                    >
                        <InfoView disabled={disabled} />
                    </TOCPage.Section>
                    <TOCPage.Section
                        id="security"
                        title={I18n.t('userpages.streams.edit.details.nav.security')}
                        onlyDesktop
                    >
                        <SecurityView disabled={disabled} />
                    </TOCPage.Section>
                    <TOCPage.Section
                        id="configure"
                        title={I18n.t('userpages.streams.edit.details.nav.fields')}
                        onlyDesktop
                    >
                        <ConfigureView disabled={disabled} />
                    </TOCPage.Section>
                    <TOCPage.Section
                        id="status"
                        linkTitle={I18n.t('userpages.streams.edit.details.nav.status')}
                        title={(
                            <div className={styles.statusTitle}>
                                {I18n.t('userpages.streams.edit.details.nav.status')}
                                &nbsp;
                                <StatusIcon tooltip status={editedStream ? editedStream.streamStatus : undefined} />
                            </div>
                        )}
                        onlyDesktop
                    >
                        <StatusView disabled={disabled} />
                    </TOCPage.Section>
                    <TOCPage.Section
                        id="preview"
                        title={I18n.t('userpages.streams.edit.details.nav.preview')}
                    >
                        <PreviewView
                            stream={editedStream}
                            currentUser={currentUser}
                        />
                    </TOCPage.Section>
                    <TOCPage.Section
                        id="api-access"
                        title={I18n.t('userpages.streams.edit.details.nav.apiAccess')}
                        onlyDesktop
                    >
                        <KeyView disabled={disabled || !hasSharePermission} />
                    </TOCPage.Section>
                    <TOCPage.Section
                        id="historical-data"
                        title={I18n.t('userpages.streams.edit.details.nav.historicalData')}
                        onlyDesktop
                    >
                        <HistoryView
                            streamId={editedStream && editedStream.id}
                            disabled={disabled}
                        />
                    </TOCPage.Section>
                </TOCPage>
            </CoreLayout>
        )
    }
}

function StreamLoader(props: Props) {
    const isMounted = useIsMounted()
    const propsRef = useRef(props)
    propsRef.current = props
    const { id: streamId } = props.match.params || {}
    const fail = useFailure()

    const initStream = useCallback(async (id: StreamId) => {
        let { current: currentProps } = propsRef
        await propsRef.current.getKeys()
        if (!isMounted()) { return }
        currentProps = propsRef.current

        try {
            await Promise.all([
                currentProps.getStream(id).then(async () => {
                    if (!isMounted()) { return }
                    // get stream status before copying state to edit stream object
                    try {
                        // the status query might fail due to cassandra problems.
                        // Ignore error to prevent the stream page from getting stuck while loading
                        await currentProps.refreshStreamStatus(id)
                    } catch (e) {
                        console.warn(e)
                    }
                    currentProps.openStream(id)
                    currentProps.initEditStream()
                }),
                currentProps.getMyStreamPermissions(id),
            ]).catch(handleLoadError)
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
    }, [isMounted, propsRef, fail])

    const createStream = useCallback(async () => {
        const { current: currentProps } = propsRef
        const newStreamId = await currentProps.createStream()
        if (!isMounted()) { return }
        currentProps.history.replace(`${links.userpages.streamShow}/${newStreamId}?newStream=true`)
        initStream(newStreamId)
    }, [initStream, propsRef, isMounted])

    const initStreamRef = useRef(initStream)
    initStreamRef.current = initStream
    const createStreamRef = useRef(createStream)
    createStreamRef.current = createStream

    useEffect(() => {
        if (streamId) {
            initStreamRef.current(streamId)
        } else {
            createStreamRef.current()
        }
    }, [streamId, createStreamRef, initStreamRef])

    const isCurrent = !!(props.editedStream && props.editedStream.id === streamId)

    useEffect(() => {
        if (!isCurrent) {
            // unset stream data if not matching current url's streamId
            const { current: currentProps } = propsRef
            currentProps.closeStream()
        }
    }, [isCurrent, propsRef])

    return <StreamShowView {...props} key={streamId} editedStream={isCurrent ? props.editedStream : null} />
}

const mapStateToProps = (state: StoreState, { location }: OwnProps): StateProps => {
    const newStream = qs.parse(location.search).newStream || ''

    return {
        editedStream: selectEditedStream(state),
        permissions: selectPermissions(state),
        currentUser: selectUserData(state),
        isFetching: selectFetching(state),
        isNewStream: !!newStream,
    }
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    createStream: () => dispatch(createStream({
        name: 'Untitled Stream',
        description: '',
    })),
    getStream: (id: StreamId) => dispatch(getStream(id)),
    getKeys: () => dispatch(getMyResourceKeys()),
    openStream: (id: StreamId) => dispatch(openStream(id)),
    closeStream: () => {
        dispatch(closeStream())
        dispatch(updateEditStream(null))
    },
    getMyStreamPermissions: (id: StreamId) => dispatch(getMyStreamPermissions(id)),
    save: (stream: ?Stream) => {
        if (stream) {
            const updateOrSave = stream.id ? updateStream : createStream
            return dispatch(updateOrSave(stream)).then(() => {
                dispatch(push(routes.userPageStreamListing()))
            })
        }
    },
    redirectToUserPages: () => dispatch(push(routes.userPages())),
    cancel: () => {
        dispatch(push(routes.userPageStreamListing()))
    },
    refreshStreamStatus: (id: StreamId) => dispatch(getStreamStatus(id)),
    updateStream: (stream: Stream) => dispatch(updateStream(stream)),
    initEditStream: () => dispatch(initEditStream()),
    initNewStream: () => dispatch(initNewStream()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter((StreamLoader)))
