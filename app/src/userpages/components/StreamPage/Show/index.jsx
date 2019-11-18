// @flow

import React, { Component, useRef, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { push } from 'connected-react-router'
import { withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import useIsMounted from '$shared/hooks/useIsMounted'
import StatusIcon from '$shared/components/StatusIcon'
import ConfigureAnchorOffset from '$shared/components/ConfigureAnchorOffset'
import type { Stream, StreamId } from '$shared/flowtype/stream-types'
import type { Operation } from '$userpages/flowtype/permission-types'
import type { StoreState } from '$shared/flowtype/store-state'
import type { User } from '$shared/flowtype/user-types'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'
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
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import DetailsContainer from '$shared/components/Container/Details'
import TOCPage from '$userpages/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import routes from '$routes'
import links from '$shared/../links'
import breakpoints from '$app/scripts/breakpoints'

import CoreLayout from '$shared/components/Layout/Core'
import InfoView from './InfoView'
import KeyView from './KeyView'
import ConfigureView from './ConfigureView'
import PreviewView from './PreviewView'
import HistoryView from './HistoryView'
import SecurityView from './SecurityView'
import StatusView from './StatusView'

import styles from './streamShowView.pcss'

const { lg } = breakpoints

type StateProps = {
    editedStream: ?Stream,
    permissions: ?Array<Operation>,
    currentUser: ?User,
    authApiKeyId: ?ResourceKeyId,
    isFetching: ?boolean,
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
            authApiKeyId,
            permissions,
            isFetching,
        } = this.props
        const hasWritePermission = (permissions && permissions.some((p) => p === 'write')) || false
        const isLoading = !!(!editedStream || isFetching)
        const disabled = !!(isLoading || !hasWritePermission)

        return (
            <CoreLayout
                hideNavOnDesktop
                loading={isLoading}
                navComponent={(
                    <MediaQuery minWidth={lg.min}>
                        {(isDesktop) => (
                            <Toolbar
                                className={Toolbar.styles.shadow}
                                altMobileLayout
                                actions={{
                                    cancel: {
                                        title: I18n.t('userpages.profilePage.toolbar.cancel'),
                                        color: 'link',
                                        outline: true,
                                        onClick: () => {
                                            cancel()
                                        },
                                    },
                                    saveChanges: {
                                        title: isDesktop ?
                                            I18n.t('userpages.profilePage.toolbar.saveAndExit') :
                                            I18n.t('userpages.profilePage.toolbar.done'),
                                        color: 'primary',
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
                <DetailsContainer className={styles.streamShowView}>
                    <TOCPage title="Set up your Stream">
                        <TOCPage.Section
                            id="details"
                            title="Details"
                        >
                            <InfoView disabled={disabled} />
                        </TOCPage.Section>
                        <TOCPage.Section
                            id="security"
                            title="Security"
                            customStyled
                        >
                            <SecurityView disabled={disabled} />
                        </TOCPage.Section>
                        <TOCPage.Section
                            id="configure"
                            title="Configure"
                            customStyled
                        >
                            <ConfigureView disabled={disabled} />
                        </TOCPage.Section>
                        <TOCPage.Section
                            id="status"
                            linkTitle="Stream Status"
                            title={(
                                <div className={styles.statusTitle}>
                                    Status <StatusIcon showTooltip status={editedStream ? editedStream.streamStatus : undefined} />
                                </div>
                            )}
                            customStyled
                        >
                            <StatusView disabled={disabled} />
                        </TOCPage.Section>
                        <TOCPage.Section
                            id="preview"
                            title="Preview"
                        >
                            <PreviewView
                                stream={editedStream}
                                currentUser={currentUser}
                                authApiKeyId={authApiKeyId}
                            />
                        </TOCPage.Section>
                        <TOCPage.Section
                            id="api-access"
                            title="API Access"
                            customStyled
                        >
                            <KeyView disabled={disabled} />
                        </TOCPage.Section>
                        <TOCPage.Section
                            id="historical-data"
                            title="Historical Data"
                            customStyled
                        >
                            <HistoryView
                                streamId={editedStream && editedStream.id}
                                disabled={disabled}
                            />
                        </TOCPage.Section>
                    </TOCPage>
                </DetailsContainer>
            </CoreLayout>
        )
    }
}

function StreamLoader(props: Props) {
    const isMounted = useIsMounted()
    const propsRef = useRef(props)
    propsRef.current = props
    const { id: streamId } = props.match.params || {}

    const initStream = useCallback(async (id: StreamId) => {
        let { current: currentProps } = propsRef
        await propsRef.current.getKeys()
        if (!isMounted()) { return }
        currentProps = propsRef.current
        return Promise.all([
            currentProps.getStream(id).then(async () => {
                if (!isMounted()) { return }
                // get stream status before copying state to edit stream object
                await currentProps.refreshStreamStatus(id)
                currentProps.openStream(id)
                currentProps.initEditStream()
            }),
            currentProps.getMyStreamPermissions(id),
        ])
    }, [isMounted, propsRef])

    const createStream = useCallback(async () => {
        const { current: currentProps } = propsRef
        const newStreamId = await currentProps.createStream()
        if (!isMounted()) { return }
        currentProps.history.replace(`${links.userpages.streamShow}/${newStreamId}`)
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

    return <StreamShowView key={streamId} {...props} editedStream={isCurrent ? props.editedStream : null} />
}

const mapStateToProps = (state: StoreState): StateProps => ({
    editedStream: selectEditedStream(state),
    permissions: selectPermissions(state),
    currentUser: selectUserData(state),
    authApiKeyId: selectAuthApiKeyId(state),
    isFetching: selectFetching(state),
})

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
